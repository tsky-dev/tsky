import { readFile } from 'node:fs/promises';
import { toNamespace } from '../utils/cache.js';
import { getDescriptions, writeJsdoc } from '../utils/docs.js';
import { mainPrelude } from '../utils/prelude.js';
import { sortDefinition, sortName, sortPropertyKeys } from '../utils/sort.js';
import { resolveType } from './resolvers/type.js';
import { type DocumentSchema, documentSchema } from './schema.js';

export interface GenerateDefinitionsOptions {
  files: string[];
  main: boolean;
  banner?: string;
  description?: string;
  debug?: boolean;
  onProgress?: (filename: string, index: number, total: number) => void;
}

export async function generateDefinitions(opts: GenerateDefinitionsOptions) {
  const { files, main, banner, description } = opts;

  let queries = '';
  let procedures = '';
  let records = '';
  let subscriptions = '';

  let code = `/* eslint-disable */
// This file is automatically generated, do not edit!`;

  if (description) {
    code += `\n\n/**
 * @module
 * ${description}
 */`;
  }

  if (main) {
    code += `\n\n${banner ?? ''}\n${mainPrelude}`;
  }
  else {
    code += `\n\nimport "@tsky/lexicons";${banner ?? ''}

declare module "@tsky/lexicons" {`;
  }

  for await (const filename of files.sort(sortName)) {
    let document: DocumentSchema;

    try {
      const jsonString = await readFile(filename, 'utf8');
      const parsed = JSON.parse(jsonString);

      if (!documentSchema(parsed)) {
        throw new Error('Invalid document schema');
      }
      document = parsed;
    }
    catch (err) {
      throw new Error(`failed to read ${filename}`, { cause: err });
    }

    const ns = document.id;
    const tsNamespace = toNamespace(ns);

    let descs: string[] = [];
    let chunk = '';

    const definitions = document.defs;
    const keys = Object.keys(definitions).sort(sortDefinition);

    for (const key of keys) {
      const def = definitions[key];
      const type = def.type;

      const nsid = `${ns}${key !== 'main' ? `#${key}` : ''}`;
      const typeName = key[0].toUpperCase() + key.slice(1);

      if (type === 'string') {
        const { value, descriptions } = resolveType(nsid, def);

        chunk += writeJsdoc(descriptions);
        chunk += `type ${typeName} = ${value};`;
      }
      else if (type === 'token') {
        chunk += `type ${typeName} = '${nsid}';`;
      }
      else if (type === 'object') {
        const required = def.required;
        const nullable = def.nullable;
        const properties = def.properties;

        const propKeys = sortPropertyKeys(Object.keys(properties), required);
        const descs = getDescriptions(def);

        chunk += writeJsdoc(descs);
        chunk += `interface ${typeName} {`;
        chunk += `[Brand.Type]: '${nsid}';`;

        for (const prop of propKeys) {
          const isOptional = !required || !required.includes(prop);
          const isNullable = nullable?.includes(prop);
          const { value, descriptions } = resolveType(
            `${nsid}/${prop}`,
            properties[prop],
          );

          chunk += writeJsdoc(descriptions);
          chunk += `${prop}${isOptional ? '?' : ''}:${value}${isNullable ? '| null' : ''};`;
        }

        chunk += '}';
      }
      else if (type === 'array') {
        const { value, descriptions } = resolveType(nsid, def.items);
        const descs = [];

        if (def.maxLength !== undefined) {
          descs.push(`Maximum array length: ${def.maxLength}`);
        }

        if (def.minLength !== undefined) {
          descs.push(`Minimum array length: ${def.minLength}`);
        }

        chunk += writeJsdoc(descs.concat(descriptions));
        chunk += `type ${typeName} = (${value})[];`;
      }
      else if (type === 'record') {
        const obj = def.record;
        const required = obj.required;
        const nullable = obj.nullable;
        const properties = obj.properties;

        const propKeys = sortPropertyKeys(Object.keys(properties), required);
        const descs = getDescriptions(def);

        chunk += writeJsdoc(descs);
        chunk += 'interface Record {';
        chunk += `$type: '${nsid}';`;

        for (const prop of propKeys) {
          const isOptional = !required || !required.includes(prop);
          const isNullable = nullable?.includes(prop);
          const { value, descriptions } = resolveType(
            `${nsid}/${prop}`,
            properties[prop],
          );

          chunk += writeJsdoc(descriptions);
          chunk += `${prop}${isOptional ? '?' : ''}:${value}${isNullable ? '| null' : ''};`;
        }

        chunk += '}';

        records += `\n'${nsid}': ${tsNamespace}.Record;`;
      }
      else if (type === 'query' || type === 'procedure') {
        let parameters = def.parameters;
        const input = type === 'procedure' ? def.input : undefined;
        const output = def.output;
        const errors = def.errors;

        descs = getDescriptions(def);

        if (parameters) {
          if (Object.values(parameters.properties).length === 0) {
            parameters = undefined;
          }
          else {
            const { value, descriptions } = resolveType(nsid, parameters);

            chunk += writeJsdoc(descriptions);
            chunk += `interface Params ${value}`;
          }
        }
        else {
          chunk += 'interface Params {}';
        }

        if (input) {
          if (input.encoding === 'application/json' && input.schema) {
            const { value, descriptions } = resolveType(nsid, input.schema);

            chunk += writeJsdoc(descriptions);

            if (input.schema?.type === 'object') {
              chunk += `interface Input ${value}`;
            }
            else {
              chunk += `type Input = ${value};`;
            }
          }
          else {
            chunk += 'type Input = Blob | ArrayBufferView;';
          }
        }
        else {
          chunk += 'type Input = undefined;';
        }

        if (output) {
          if (output.encoding === 'application/json' && output.schema) {
            const { value, descriptions } = resolveType(nsid, output.schema);

            chunk += writeJsdoc(descriptions);

            if (output.schema?.type === 'object') {
              chunk += `interface Output ${value}`;
            }
            else {
              chunk += `type Output = ${value};`;
            }
          }
          else {
            chunk += 'type Output = Uint8Array;';
          }
        }
        else {
          chunk += 'type Output = undefined;';
        }

        if (errors) {
          chunk += 'interface Errors {';

          for (const error of errors) {
            chunk += `${error.name}: {};`;
          }

          chunk += '}';
        }

        {
          let rc = `'${ns}':{\n`;

          if (parameters) {
            rc += `params: ${tsNamespace}.Params;`;
          }
          if (input) {
            rc += `input: ${tsNamespace}.Input;`;
          }
          if (output) {
            rc += `output: ${tsNamespace}.Output;`;
          }

          rc += '};';

          if (type === 'query') {
            queries += rc;
          }
          else if (type === 'procedure') {
            procedures += rc;
          }
        }
      }
      else if (type === 'blob') {
        const { value, descriptions } = resolveType(nsid, def);

        chunk += writeJsdoc(descriptions);
        chunk += `type ${typeName} = ${value};`;
      }
      else if (type === 'bytes') {
        const { value, descriptions } = resolveType(nsid, def);

        chunk += writeJsdoc(descriptions);
        chunk += `type ${typeName} = ${value};`;
      }
      else if (type === 'subscription') {
        if (def.parameters) {
          const { value, descriptions } = resolveType(nsid, def.parameters);
          chunk += writeJsdoc(descriptions);
          chunk += `interface Params ${value}`;
        }
        else {
          chunk += 'interface Params {}';
        }

        if (def.message?.schema) {
          const { value: messageValue, descriptions: messageDesc }
            = resolveType(nsid, def.message.schema);
          chunk += writeJsdoc(messageDesc);
          chunk += `type Message = ${messageValue};`;
        }

        if (def.errors) {
          chunk += 'interface Errors {';
          for (const error of def.errors) {
            chunk += `${error.name}: {};`;
          }
          chunk += '}';
        }

        let rc = `'${ns}':{\n`;
        if (def.parameters) {
          rc += `params: ${tsNamespace}.Params;`;
        }
        if (def.message?.schema) {
          rc += `message: ${tsNamespace}.Message;`;
        }
        if (def.errors) {
          rc += `errors: ${tsNamespace}.Errors;`;
        }
        rc += '};';
        subscriptions += rc;
      }
      else {
        // eslint-disable-next-line no-console
        console.log(`${nsid}: unhandled type ${type}`);
      }
    }

    code += writeJsdoc(descs);

    if (main) {
      code += `export declare namespace ${tsNamespace} {`;
    }
    else {
      code += `namespace ${tsNamespace} {`;
    }

    code += chunk;
    code += '}\n\n';
  }

  if (main) {
    code += `export declare interface Records {${records}}\n\n`;
    code += `export declare interface Queries {${queries}}\n\n`;
    code += `export declare interface Procedures {${procedures}}\n\n`;
    code += `export declare interface Subscriptions {${subscriptions}}\n\n`;
  }
  else {
    code += `interface Records {${records}}\n\n`;
    code += `interface Queries {${queries}}\n\n`;
    code += `interface Procedures {${procedures}}\n\n`;
    code += `interface Subscriptions {${subscriptions}}\n\n`;
    code += '}';
  }

  return code;
}

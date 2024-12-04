import { writeFile } from 'node:fs/promises';
import process from 'node:process';
import { Builtins, Cli, Command, Option } from 'clipanion';
import pc from 'picocolors';
import prettier from 'prettier';
import * as t from 'typanion';
import { generateDefinitions } from './generator/index.js';

const cli = new Cli({
  binaryName: 'lex-cli',
  binaryVersion: '0.0.0',
});

cli.register(Builtins.HelpCommand);

cli.register(
  class GenerateTypes extends Command {
    static paths = [['generate-types']];

    static usage = Command.Usage({
      description:
        'Generates TypeScript type definitions from Lexicon schema files',
      details: `
        This command takes Lexicon JSON schema files as input and generates corresponding TypeScript
        type definitions. It handles all AT Protocol lexicons (app.bsky, com.atproto, etc.) and
        outputs a single consolidated TypeScript declaration file.
      `,
      examples: [
        [
          'Basic usage',
          'lex-cli generate-types ./lexicons/**/*.json -o types.ts',
        ],
        [
          'With module description',
          'lex-cli generate-types ./lexicons/**/*.json -o types.ts --description "AT Protocol Types"',
        ],
      ],
    });

    output = Option.String('-o,--output', {
      required: false,
      description:
        'Path for the generated TypeScript definition file. If not specified, outputs to stdout',
      validator: t.cascade(t.isString(), t.matchesRegExp(/\.ts$/)),
    });

    desc = Option.String('--description', {
      required: false,
      description: 'JSDoc description to add to the generated module',
    });

    banner = Option.String('--banner', {
      required: false,
      description:
        'Custom banner text to insert at the top of the generated file',
    });

    metadata = Option.String('--metadata', {
      required: false,
      description: 'JSON metadata to add to the generated file header',
    });

    files = Option.Rest({
      required: 1,
      name: 'files',
    });

    async execute(): Promise<number | undefined> {
      let code: string;

      try {
        code = await generateDefinitions({
          files: this.files,
          banner: this.banner,
          description: this.desc,
          lexiconMetadata: this.metadata
            ? JSON.parse(this.metadata)
            : undefined,
        });
      } catch (err) {
        if (err instanceof Error) {
          console.error(pc.bold(`${pc.red('error:')} ${err.message}`));

          if (err.cause instanceof Error) {
            console.error(`  ${pc.gray('caused by:')} ${err.cause.message}`);
          }
        } else {
          console.error(pc.bold(pc.red('unknown error occurred:')));
          console.error(err);
        }

        return 1;
      }

      const config = await prettier.resolveConfig(
        this.output || process.cwd(),
        { editorconfig: true },
      );
      const formatted = await prettier.format(code, {
        ...config,
        parser: 'typescript',
      });

      if (this.output) {
        await writeFile(this.output, formatted);
      } else {
        // eslint-disable-next-line no-console
        console.log(formatted);
      }
    }
  },
);

(async () => {
  const exitCode = await cli.run(process.argv.slice(2));
  process.exitCode = exitCode;
})();

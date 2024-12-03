import { writeFile } from 'node:fs/promises';
import process from 'node:process';
import { Builtins, Command, Option, Cli } from 'clipanion';
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
  class GenerateMainLexicons extends Command {
    static paths = [['generate-main']];

    static usage = Command.Usage({
      description: 'Generates the main type definition file',
    });

    output = Option.String('-o,--output', {
      required: false,
      description:
        'Where to save the resulting type definition file, defaults to stdout if not passed',
      validator: t.cascade(t.isString(), t.matchesRegExp(/\.ts$/)),
    });

    desc = Option.String('--description', {
      required: false,
      description: 'Module description',
    });

    banner = Option.String('--banner', {
      required: false,
      description: 'Insert an arbitrary string at the beginning of the module',
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
          main: true,
          banner: this.banner,
          description: this.desc,
        });
      }
      catch (err) {
        if (err instanceof Error) {
          console.error(pc.bold(`${pc.red('error:')} ${err.message}`));

          if (err.cause instanceof Error) {
            console.error(`  ${pc.gray('caused by:')} ${err.cause.message}`);
          }
        }
        else {
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
      }
      else {
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

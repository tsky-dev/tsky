import { execSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TYPES_OUTPUT_PATH = path.resolve(__dirname, '../src/lib/lexicons.ts');

async function main() {
  try {
    const command = [
      'git diff --unified=0',
      TYPES_OUTPUT_PATH,
      '| grep -q "* Source:"',
      '&& echo yes',
      '|| echo no',
    ].join(' ');

    execSync(command, {
      stdio: 'inherit',
      env: process.env,
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

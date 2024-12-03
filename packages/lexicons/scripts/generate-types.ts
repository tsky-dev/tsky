import { Buffer } from 'node:buffer';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import glob from 'fast-glob';
import * as tar from 'tar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEXICONS_DIR = path.resolve(__dirname, '../lexicons');
const TYPES_OUTPUT_PATH = path.resolve(__dirname, '../src/lib/lexicons.ts');
const LEX_CLI_PATH = path.resolve(__dirname, '../../lex-cli/dist/index.js');
const REPO = 'bluesky-social/atproto';

async function downloadLexicons() {
  console.log('Getting latest lexicon commit...');
  const shaResponse = await fetch(
    `https://api.github.com/repos/${REPO}/commits?path=lexicons/`,
  );
  if (!shaResponse.ok) {
    throw new Error(`Failed to get commit SHA: ${shaResponse.statusText}`);
  }

  const commits = await shaResponse.json();
  const sha = commits[0]?.sha;
  if (!sha) {
    throw new Error('No commits found for lexicons');
  }

  console.log('Downloading lexicons from atproto...');
  const response = await fetch(
    `https://github.com/${REPO}/archive/${sha}.tar.gz`,
  );
  if (!response.ok) {
    throw new Error(`Failed to download lexicons: ${response.statusText}`);
  }

  const tarFile = path.join(LEXICONS_DIR, 'atproto.tar.gz');
  await fs.writeFile(tarFile, Buffer.from(await response.arrayBuffer()));

  await tar.x({
    file: tarFile,
    cwd: LEXICONS_DIR,
    filter: path => path.includes('/lexicons/'),
    strip: 2,
  });

  await fs.unlink(tarFile);
}

async function main() {
  try {
    await fs.mkdir(LEXICONS_DIR, { recursive: true });
    await fs.mkdir(path.dirname(TYPES_OUTPUT_PATH), { recursive: true });

    await downloadLexicons();

    const globPatterns = [
      'app/bsky/**/*.json',
      'chat/bsky/**/*.json',
      'com/atproto/**/*.json',
      'tools/ozone/**/*.json',
    ];

    const lexiconFiles = await glob(globPatterns, {
      cwd: LEXICONS_DIR,
      absolute: true,
    });

    if (lexiconFiles.length === 0) {
      throw new Error('No lexicon files found');
    }

    console.log('Building lex-cli...');
    execSync('pnpm --filter @tsky/lex-cli build', {
      stdio: 'inherit',
      env: process.env,
    });

    const command = [
      'node',
      LEX_CLI_PATH,
      'generate-types',
      ...lexiconFiles,
      '-o',
      TYPES_OUTPUT_PATH,
      '--description',
      '"Contains type declarations for Bluesky lexicons"',
    ].join(' ');

    console.log('Running lex-cli to generate types...');
    execSync(command, {
      stdio: 'inherit',
      env: process.env,
    });

    console.log('Done! Types generated at', TYPES_OUTPUT_PATH);
  }
  catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

import { Buffer } from 'node:buffer';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as tar from 'tar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEXICONS_DIR = path.resolve(__dirname, '../lexicons');
const TYPES_DIR = path.resolve(__dirname, '../src');
const REPO = 'bluesky-social/atproto';

async function findJsonFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findJsonFiles(fullPath));
    }
    else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  try {
    // Ensure directories exist
    await fs.mkdir(LEXICONS_DIR, { recursive: true });
    await fs.mkdir(TYPES_DIR, { recursive: true });

    // Get latest commit SHA for lexicons
    console.log('Getting latest lexicon commit...');
    const shaResponse = await fetch(`https://api.github.com/repos/${REPO}/commits?path=lexicons/`);
    if (!shaResponse.ok) {
      throw new Error(`Failed to get commit SHA: ${shaResponse.statusText}`);
    }

    const commits = await shaResponse.json();
    const sha = commits[0]?.sha;
    if (!sha) {
      throw new Error('No commits found for lexicons');
    }

    // Download specific commit's lexicons
    console.log('Downloading lexicons from atproto...');
    const response = await fetch(`https://github.com/${REPO}/archive/${sha}.tar.gz`);
    if (!response.ok) {
      throw new Error(`Failed to download lexicons: ${response.statusText}`);
    }

    // Create a temporary file for the tar download
    const tarFile = path.join(LEXICONS_DIR, 'atproto.tar.gz');
    await fs.writeFile(tarFile, Buffer.from(await response.arrayBuffer()));

    // Extract only lexicon files
    await tar.x({
      file: tarFile,
      cwd: LEXICONS_DIR,
      filter: path => path.includes('/lexicons/'),
      strip: 2,
    });

    // Clean up tar file
    await fs.unlink(tarFile);

    // Find all lexicon JSON files
    console.log('Finding lexicon files...');
    const lexiconFiles = await findJsonFiles(LEXICONS_DIR);
    if (lexiconFiles.length === 0) {
      throw new Error('No lexicon files found');
    }

    // Generate types using @atproto/lex-cli
    console.log('Generating types...');
    execSync(
      `pnpm lex gen-api ${TYPES_DIR} ${lexiconFiles.join(' ')}`,
      {
        stdio: 'inherit',
        cwd: TYPES_DIR,
      },
    );

    console.log('Done! Types generated in', TYPES_DIR);
  }
  catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

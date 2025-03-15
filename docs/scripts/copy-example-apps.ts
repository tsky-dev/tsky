import fs from 'node:fs/promises';

const apps = await fs.readdir('../examples');

for (const app of apps) {
  console.log(`copying example app ${app} ...`);
  fs.cp(`../examples/${app}/dist`, `./.vitepress/dist/examples/${app}`, {
    recursive: true,
  });
}

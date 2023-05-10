import * as esbuild from 'esbuild';
import * as fs from 'node:fs';
import lodashPlugin from 'esbuild-plugin-lodash';

const version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;

const TAGS = [
  ['name', 'nga mobile'],
  ['namespace', 'ding-js'],
  ['version ', version],
  [
    'description',
    '官方 APP 体验糟糕，广告多的离谱，而官方的移动端网页浏览起来体验很差，主要是字号、缩放的一些问题，这个脚本优化了交互和样式，让网页从几乎没法看升级为正常能用的状态',
  ],
  ['author', 'ding-js'],
  ['match ', '*://bbs.nga.cn/*'],
  [
    'icon',
    'data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAA1sq7AIRjNwB+WywA0sa1AN/WywCTeFAAgV8xAKGIZgCIZzwAqJBxANvSxQB/XS4A/Pv6AMe3owCLa0EAknNMAKKKaAD///8AjW9GAIttQwCMbUMApo5tAMy/rQB1UB4AiGk9AMu9qgCPcUgAybunAH9cLgDTx7cAfVorAHtYKADRxbQAvqyVAHxYKAC1oocAeVYlALuojwB9WioA3dXJAIJgMgDe1ckAvKqRAIZmOgCAXi8A9vTwAJp/WQCehWEA4dnOAJJ0TQCDYjQAwrKbAM/CsQDp49sAx7ijAOfh2ADu6eMAsp2BAKyVdgB8WSoAkHJJAJ2CXwDXzL4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBwcHHyQEAgcHBwcAAAAHBwcHIC8NEiI8BwcHBwAHBwcHLQMmEhI/IAcHBwcHBwcHBy0tHBISOjwtBwcHBwcHBwwdPAg4JB0VDx0HBwcHBx0zCQcHLCU9NjEPHQcHBwMVNSgZDAMzMRISLwMHBwclFhISFR8nHBISGiUgKQcHAgsSLhkHNxISHhgXNSUHBx00EhIhMRINKykwLzUlBwc8GwsSEhIBCjI+Cw4lBwcHKSMpIgQRMxg0OT4FMgwHBwcpAx0yAjs5BiomMwItBwcHBwcDNjgnBRoUJCwMBwcABwcHDBYBPhAaGR8pBwcAAAAHBwclEy8DLAktBwcAAMADAACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAMADAAA=',
  ],
  ['grant', 'GM_addStyle'],
  ['run-at', 'document-body'],
];

const COMMENTS = `// ==UserScript==\n${TAGS.map(
  ([k, v]) => `// @${k}${' '.repeat(15 - k.length)}${v}`
).join('\n')}\n// ==/UserScript==`;

const config = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  outdir: 'dist',
  write: false,
  plugins: [
    {
      name: 'tampermonkey-tags',
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length) {
            result.errors.forEach((err) => {
              console.error(err);
            });
            return;
          }
          result.outputFiles.forEach(({ path, text }) => {
            fs.writeFileSync(path, `${COMMENTS}\n\n${text}`, 'utf8');
          });
        });
      },
    },
    lodashPlugin(),
  ],
};
async function main() {
  fs.mkdirSync('dist', {
    recursive: true,
  });
  if (process.argv.includes('--watch')) {
    const ctx = await esbuild.context(config);
    await ctx.watch();
  } else {
    await esbuild.build(config);
  }
}

main();

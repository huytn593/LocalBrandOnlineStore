import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexFile = resolve(distDir, 'index.html');
const notFoundFile = resolve(distDir, '404.html');

if (!existsSync(indexFile)) {
  throw new Error(`Cannot create 404.html because ${indexFile} does not exist.`);
}

const indexHtml = readFileSync(indexFile, 'utf8');
const projectPathMatch = indexHtml.match(/"([^"]*\/LocalBrandOnlineStore\/)assets\//);
const projectPath = projectPathMatch ? projectPathMatch[1] : '/';

const notFoundHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>LocalBrand Online Store</title>
    <script>
      (function () {
        var pathname = window.location.pathname;
        var projectPath = '${projectPath}';
        var normalizedProjectPath = projectPath.endsWith('/') ? projectPath : projectPath + '/';
        var routePath = pathname.startsWith(normalizedProjectPath)
          ? pathname.slice(normalizedProjectPath.length)
          : pathname.replace(/^\\//, '');
        var search = window.location.search ? window.location.search.replace(/^\\?/, '&') : '';
        var hash = window.location.hash || '';
        var targetPath = '${projectPath}' + (routePath ? '?p=/' + routePath.replace(/&/g, '~and~') : '');
        window.location.replace(window.location.origin + targetPath + search + hash);
      })();
    </script>
  </head>
  <body></body>
</html>
`;

writeFileSync(notFoundFile, notFoundHtml);

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (
      specifier.startsWith('.') ||
      specifier.startsWith('/') ||
      specifier.startsWith('file://')
    ) {
      const parentDir = context.parentURL
        ? path.dirname(fileURLToPath(context.parentURL))
        : process.cwd();
      const targetPath = path.resolve(parentDir, specifier);

      const candidates = [
        targetPath,
        targetPath + '.js',
        targetPath + '.mjs',
        targetPath + '.json',
        path.join(targetPath, 'index.js'),
        path.join(targetPath, 'index.mjs'),
      ];

      for (const cand of candidates) {
        if (fs.existsSync(cand) && !fs.statSync(cand).isDirectory()) {
          return {
            shortCircuit: true,
            url: pathToFileURL(cand).href,
          };
        }
      }

      // If unresolved and begins with relative path traversing from subfolders
      // check if it points to root directories (lib, models, data, components, utils, etc.)
      const match = specifier.match(/^(?:\.\.\/)+((?:lib|models|data|components|utils|constants|styles|pages)\/.*)$/);
      if (match) {
        const rootRel = match[1];
        const rootTarget = path.resolve(process.cwd(), rootRel);
        const rootCandidates = [
          rootTarget,
          rootTarget + '.js',
          rootTarget + '.mjs',
          rootTarget + '.json',
          path.join(rootTarget, 'index.js'),
        ];
        for (const cand of rootCandidates) {
          if (fs.existsSync(cand) && !fs.statSync(cand).isDirectory()) {
            return {
              shortCircuit: true,
              url: pathToFileURL(cand).href,
            };
          }
        }
      }
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.source) {
    const sourceStr = typeof result.source === 'string' ? result.source : Buffer.from(result.source).toString('utf8');
    if (sourceStr.includes('CredentialsProvider(') || sourceStr.includes('NextAuth(')) {
      const transformed = sourceStr
        .replace(/CredentialsProvider\(/g, '(CredentialsProvider?.default || CredentialsProvider)(')
        .replace(/NextAuth\(/g, '(NextAuth?.default || NextAuth)(');
      return {
        ...result,
        format: 'module',
        source: transformed,
      };
    }
  }
  return result;
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// surely ESModules worth it!
function fileDirName(meta) {
  const __filename = fileURLToPath(meta.url);
  const __dirname = path.dirname(__filename);
  return { __dirname, __filename };
}

const { __dirname, __filename } = fileDirName(import.meta);

const errorsPyPath = path.join(__dirname, '../python/ccxt/base/errors.py');

const contents = fs.readFileSync(errorsPyPath, { encoding: 'utf-8'});

fs.writeFileSync(errorsPyPath, contents.replace(/export\sdefault\serror_hierarchy/g, ''), { encoding: 'utf-8'});
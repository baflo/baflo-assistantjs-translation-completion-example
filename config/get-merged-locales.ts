import * as fs from "fs";
import * as path from "path";

/** Merges all translation files into one single file */
function getMergedLocales() {
  const i18nTranslations = {};

  // Find all subdirs and associate directory name to language
  const langs = fs
    .readdirSync(__dirname)
    .filter(fn => fs.statSync(path.join(__dirname, fn)).isDirectory());

  // Load all subdirs into translations object
  for (const dir of langs) {
    i18nTranslations[dir] = {};
    loadToObject(i18nTranslations[dir], path.join(__dirname, dir));
  }

  return i18nTranslations;
}

/** Allows to require ES6/TS default exports, CommonJS modules or JSON files */
function requireDefault(p: string) {
  const r = require(p);
  return r.default || r;
}

/** 
 * Recursively requires all files in given folder and subfolders. Folder and file structure is
 * mirrored in the object's structure. If one file is not require-able, the function fails.
 */
function loadToObject(obj: {}, dirPath: string) {
  fs.readdirSync(dirPath).forEach(f => {
    const fn = path.join(dirPath, f);

    if (fs.statSync(fn).isDirectory()) {
      loadToObject((obj[baseWithoutExtension(f)] = {}), fn);
    } else {
      const data = requireDefault(fn);

      if (data) {
        obj[baseWithoutExtension(f)] = data;
      }
    }
  });
}

/** Returns name of the file in a given path without its exten */
function baseWithoutExtension(fn: string) {
  return path.basename(fn, path.extname(fn));
}


export default getMergedLocales();

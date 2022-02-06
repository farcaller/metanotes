import glob = require('glob');
import fs = require('fs');
import path = require('path');
import globWatcher = require('glob-watcher');
import { Observable } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import { ExecutorContext } from '@nrwl/devkit';
import ejs = require('ejs');

import { BuildExecutorSchema } from './schema';

const SCRIBBLE_TEMPLATE_TEXT = fs.readFileSync(path.join(__dirname, 'scribble.ts__template__'), 'utf-8');
const SCRIBBLE_TEMPLATE = ejs.compile(SCRIBBLE_TEMPLATE_TEXT);

interface ScribbleInfo {
  attributes: { [key: string]: string };
  compiled: string;
}

function processScribble(sourceFile: string, source: string): ScribbleInfo {
  const lines = source.split('\n');

  // check the magic
  if (lines.shift() !== '/* attributes *') {
    throw Error(`magic not found in ${sourceFile}`);
  }

  const attrs = {} as { [key: string]: string };
  while (lines.length > 0) {
    const l = lines.shift()!;
    if (l === ' */') {
      break;
    }

    const groups = l.match(/ \*\s+([^:]+)\s*:\s*(.*)/);
    if (!groups) {
      throw Error(`cannot parse attribute from "${l}"`);
    }
    const [_, k, v] = groups;
    attrs[k] = v;
  }
  if (!attrs.id) {
    throw Error('id not present in attributes');
  }
  if (!attrs['content-type']) {
    throw Error('content-type not present in attributes');
  }
  if (!attrs['title']) {
    throw Error('content-type not present in attributes');
  }
  // TODO: resolve slugs from elsewhere
  attrs['mn-slug'] = attrs['title'];
  attrs['mn-content-type'] = attrs['content-type'];
  const { id } = attrs;
  delete attrs.id;
  delete attrs['content-type'];

  let body = lines.join('\n').trim();

  body += `\n//# sourceURL=${sourceFile}`;

  // let output = `"use strict";\n`;
  // output += 'Object.defineProperty(exports, "__esModule", { value: true });\n';
  // output += `const scribble = {\n`;
  // output += `  id: '${id}',\n`;
  // output += `  attributes: ${JSON.stringify(attrs)},\n`;
  // output += `  body: ${JSON.stringify(body)},\n`;
  // output += `};\n`;
  // output += `exports.default = scribble;\n`;

  return {
    attributes: attrs,
    compiled: SCRIBBLE_TEMPLATE({
      attrs,
      body,
      id,
    }),
  };
}

function generateScribble(sourceFile: string, outputDir: string): string {
  const source = fs.readFileSync(sourceFile, { encoding: 'utf-8' });
  const output = processScribble(sourceFile, source);
  const title = output.attributes['title'];
  const outPath = path.join(outputDir, title);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(`${outPath}.js`, output.compiled);
  console.log(
    `built scribble ${output.attributes['title']} from ${sourceFile}`
  );
  return title;
}

function generateIndex(scribbleTitles: string[], outputDir: string) {
  let output = `"use strict";\n\n`;
  let idx = 0;
  for (const title of scribbleTitles) {
    output += `import scribble_${idx} from './${title}'\n`;
    ++idx;
  }

  output += `\nexport default [\n`;
  for (let idx = 0; idx < scribbleTitles.length; ++idx) {
    output += `  scribble_${idx},\n`;
  }

  output += `];\n`;

  const outPath = path.join(outputDir, 'index');
  fs.writeFileSync(`${outPath}.js`, output);

  console.log(`built scribble index for ${scribbleTitles.length} scribbles`);
}

export default async function* runExecutor(
  options: BuildExecutorSchema,
) {
  const files = glob.sync(options.scribbleFilePatterns);

  if (options.watch !== true) {
    const titles = files.map((sourceFile) =>
      generateScribble(sourceFile, options.outputPath)
    );
    generateIndex(titles, options.outputPath);
    // TODO: this doesn't work because nx thinks the cache is good enough
    yield {
      success: true,
      outputPath: options.outputPath,
    };
    return;
  } else {
    const observable = new Observable<string>((subscriber) => {
      const watcher = globWatcher([options.scribbleFilePatterns]);
      watcher.on('change', function (path: string) {
        subscriber.next(path);
      });
    });

    const titles = files.map((sourceFile) =>
      generateScribble(sourceFile, options.outputPath)
    );
    generateIndex(titles, options.outputPath);

    for await (const sourceFile of eachValueFrom(observable)) {
      generateScribble(sourceFile, options.outputPath);
      generateIndex(titles, options.outputPath);
      yield sourceFile;
    }
  }
}

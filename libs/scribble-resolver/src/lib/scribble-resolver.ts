import * as React from 'react';

import { transform, availablePlugins } from '@babel/standalone';

import { scribbleRequire } from './require';
import { Scribble } from './types';

interface Exports {
  default?: unknown;
  [key: string]: unknown;
}

/** Resolves the latest stable scribble version to whatever it exports. */
export function resolveScribble<T>(scribble: Scribble): T {
  let modBody;
  const stableVersion = scribble.latestStableVersion;
  if (!stableVersion) {
    throw Error(
      `failed to transpile the body of scribble ${scribble.scribbleID}: ` +
        `no stable version available`
    );
  }
  const body = stableVersion.body;
  if (!body) {
    throw Error(
      `failed to transpile the body of scribble ${scribble.scribbleID} ` +
        `version ${stableVersion.versionID}: no body available`
    );
  }

  try {
    modBody = transform(body, {
      comments: false,
      compact: true,
      presets: ['env', 'react'],
      plugins: [[availablePlugins['transform-typescript'], { isTSX: true }]],
    }).code;
  } catch (e) {
    throw Error(
      `failed to transpile the body of scribble ${scribble.scribbleID} ` +
        `version ${stableVersion.versionID}: ${e}`
    );
  }
  if (modBody === null || modBody === undefined) {
    throw Error(
      `failed to transpile the body of scribble ${scribble.scribbleID} ` +
        `version ${stableVersion.versionID}:`
    );
  }
  const exports = {} as Exports;

  new Function('exports', 'React', 'require', modBody)(
    exports,
    React,
    scribbleRequire
  );

  return (exports.default !== undefined ? exports.default : exports) as T;
}

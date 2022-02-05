import * as ReactNative from 'react-native';
import * as React from 'react';

const knownModules: { [key: string]: unknown } = {
  'react-native': ReactNative,
  'react': React,
};

/// scribbleRequire implements the require() api within scribbles.
export function scribbleRequire(mod: string) {
  const resolved = knownModules[mod];
  if (resolved === undefined) {
    throw Error(`cannot resolve module ${mod}`);
  }
  return resolved;
}

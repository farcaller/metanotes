import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { ScribblesGeneratorGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/react';
import { Linter } from '@nrwl/linter';
import { updateJson } from '@nrwl/devkit';
import { ulid } from 'ulid';

interface NormalizedSchema extends ScribblesGeneratorGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: ScribblesGeneratorGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/scribbles/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    ulid: ulid(),
    project: options.projectName,
    title: options.title,
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (
  tree: Tree,
  options: ScribblesGeneratorGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  await libraryGenerator(tree, {
    name: options.name,
    style: 'none',
    routing: false,
    skipTsConfig: false,
    skipFormat: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    directory: 'scribbles',
  });  
  tree.delete(`${normalizedOptions.projectRoot}/src/index.ts`);
  tree.delete(`${normalizedOptions.projectRoot}/jest.config.js`);
  updateJson(tree, `${normalizedOptions.projectRoot}/.babelrc`, () => {
    return { extends: '../.babelrc' };
  });
  updateJson(tree, `${normalizedOptions.projectRoot}/project.json`, (json) => {
    json.implicitDependencies = [
      'scribbles-generator',
      'scribbles-pack',
    ];
    return json;
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

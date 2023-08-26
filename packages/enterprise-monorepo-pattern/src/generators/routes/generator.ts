import { formatFiles, getWorkspaceLayout, names, Tree } from '@nx/devkit';
import { RoutesGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/angular/generators';
import {
  addFiles,
  BaseNormaliedSchemaType,
  updateDomainDependencyConstraints,
} from 'utils';

type NormalizedSchema = RoutesGeneratorSchema & BaseNormaliedSchemaType;

function normalizeOptions(
  tree: Tree,
  options: RoutesGeneratorSchema
): NormalizedSchema {
  const fileName = names(options.name).fileName;
  const name =
    fileName === 'routes'
      ? fileName
      : `routes-${names(options.name).fileName}`;
  const projectDirectory = options.domain
    ? `${names(options.domain).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const domainDirectory = `${getWorkspaceLayout(tree).libsDir}/${
    options.domain
  }`;
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = [
    'type:routes',
    `domain:${names(options.domain).fileName}`,
  ];

  return {
    ...options,
    name,
    projectName,
    projectRoot,
    projectDirectory,
    domainDirectory,
    parsedTags,
  };
}

export default async function (tree: Tree, options: RoutesGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  await libraryGenerator(tree, {
    name: normalizedOptions.name,
    directory: normalizedOptions.domainDirectory,
    tags: normalizedOptions.parsedTags.join(','),
    skipModule: true,
  });

  addFiles(tree, normalizedOptions, __dirname);

  updateDomainDependencyConstraints(tree, normalizedOptions.domain);

  await formatFiles(tree);
}

import { Tree } from '@nx/devkit';
import { checkIfRuleExists } from './check-if-rule-exists.util';
import { DependencyConstraint } from './types/dependency-contraint.type';

export function updateDependencyConstraints(
  host: Tree,
  update: (depConst: DependencyConstraint[]) => void
) {
  const filePath = '.eslintrc.json';
  const rule = 'nx-enforce-module-boundaries';
  const text = host.read(filePath)?.toString() ?? '';
  const json = JSON.parse(text);
  let rules = json;
  if (rules['overrides']) {
    const overrides = rules['overrides'];
    rules = overrides.find(
      (e: { rules: { [x: string]: unknown } }) =>
        e.rules && e.rules['@nx/enforce-module-boundaries']
    );
  }

  if (!checkIfRuleExists(rule, rules)) {
    return;
  }

  const depConst = rules['rules'][rule][1][
    'depConstraints'
  ] as DependencyConstraint[];
  update(depConst);

  const newText = JSON.stringify(json, undefined, 2);
  host.write(filePath, newText);
}

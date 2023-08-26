// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkIfRuleExists(rule: string, rules: any) {
  if (
    !rules['rules'] ||
    !rules['rules'][rule] ||
    rules['rules'][rule]['length'] < 2 ||
    !rules['rules'][rule][1]['depConstraints'] ||
    !Array.isArray(rules['rules'][rule][1]['depConstraints'])
  ) {
    console.error('Invalid dependency rules!');
    return false;
  }

  return true;
}

import { Tree } from '@nx/devkit';
import { DependencyConstraint } from './types/dependency-contraint.type';
import { updateDependencyConstraints } from './update-dependency-constraints.util';

export function updateDomainDependencyConstraints(tree: Tree, domain: string) {
  updateDependencyConstraints(
    tree,
    (depConst: DependencyConstraint[]) => {
      if (!depConst.some((d) => d.sourceTag === `domain:${domain}`)) {
        depConst.push({
          sourceTag: `domain:${domain}`,
          onlyDependOnLibsWithTags: [`domain:${domain}`, 'domain:shared'],
        });
      }
    }
  );
}

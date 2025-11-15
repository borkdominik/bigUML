// navigation/base-by-name-navigation-target-resolver.ts
import { NavigationTarget } from '@eclipse-glsp/protocol';
import { GModelElement, GModelElementConstructor, NavigationTargetResolution, NavigationTargetResolver } from '@eclipse-glsp/server';
import { BaseDiagramModelState } from './base-diagram-model-state.js';

type HasName = { name?: string };

export abstract class AbstractByNameNavigationTargetResolver<Node extends GModelElement & HasName> extends NavigationTargetResolver {
    abstract readonly modelState: BaseDiagramModelState;

    protected abstract readonly nodeCtor: GModelElementConstructor<Node>;

    protected readonly argKey = 'name';

    protected normalize(x?: string): string {
        return (x ?? '').trim();
    }

    async resolve(navigationTarget: NavigationTarget): Promise<NavigationTargetResolution> {
        const args = navigationTarget.args ?? {};
        const raw = args[this.argKey];

        if (typeof raw !== 'string') {
            return NavigationTargetResolution.EMPTY;
        }

        const query = this.normalize(raw);
        const nodes = this.modelState.index.getAllByClass(this.nodeCtor);
        const match = nodes.find(n => this.normalize(n.name) === query);

        if (match) {
            return new NavigationTargetResolution([match.id]);
        }
        return new NavigationTargetResolution([], this.createArgsWithWarning(`Couldn't find element with ${this.argKey} '${raw}'`));
    }
}

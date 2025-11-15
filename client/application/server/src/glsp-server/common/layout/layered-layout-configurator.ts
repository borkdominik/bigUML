import { AbstractLayoutConfigurator, LayoutOptions } from '@eclipse-glsp/layout-elk';
import { GGraph } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class LayeredLayoutConfigurator extends AbstractLayoutConfigurator {
    protected override graphOptions(_graph: GGraph): LayoutOptions | undefined {
        return {
            'elk.algorithm': 'layered'
        };
    }
}

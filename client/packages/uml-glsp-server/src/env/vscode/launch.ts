/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { UmlDiagramServices, UmlDiagramSharedServices } from '@borkdominik-biguml/uml-model-server';
import { UmlDiagramLSPServices } from '@borkdominik-biguml/uml-model-server/integration';
import { configureELKLayoutModule } from '@eclipse-glsp/layout-elk';
import { LoggerFactory, type MaybePromise } from '@eclipse-glsp/server';
import { SocketServerLauncher } from '@eclipse-glsp/server/node.js';
import { Container, ContainerModule } from 'inversify';
import { createBigAppModule } from './app-module.js';
import { UmlDiagramModule } from './diagram/diagram-module.js';
import { DiagramFeatureModule } from './features/index.js';
import { LayeredLayoutConfigurator } from './features/layout/layered-layout-configurator.js';
import { UmlServerModule } from './module.js';

const GLSP_SERVER_PORT = 5007;
const GLSP_SERVER_HOST = '127.0.0.1';

/**
 * Launches a GLSP server with access to the given language services on the default port.
 *
 * @param services language services
 * @returns a promise that is resolved as soon as the server is shut down or rejects if an error occurs
 */
export function startGLSPServer(services: UmlDiagramLSPServices, modules: (ContainerModule | DiagramFeatureModule)[]): MaybePromise<void> {
    // create custom app module using our own logger instead of Winston
    const appModule = createBigAppModule();
    // create custom module to bind language services to support injection within GLSP classes
    const lspModule = createLSPModule(services);

    // create app container will all necessary modules and retrieve launcher
    const appContainer = new Container();
    appContainer.load(appModule, lspModule);
    const logger = appContainer.get<LoggerFactory>(LoggerFactory)('BigUmlServer');
    const launcher = appContainer.resolve<SocketServerLauncher>(SocketServerLauncher);
    // use Eclipse Layout Kernel with our custom layered layout configuration
    const elkLayoutModule = configureELKLayoutModule({
        algorithms: ['layered'],
        layoutConfigurator: LayeredLayoutConfigurator
    });

    const classDiagramModule = new UmlDiagramModule();
    const containerModules: ContainerModule[] = [];
    for (const module of modules) {
        if (module instanceof DiagramFeatureModule) {
            classDiagramModule.addDiagramFeatureModule(module);
        } else {
            containerModules.push(module);
        }
    }

    const serverModule = new UmlServerModule().configureDiagramModule(classDiagramModule, elkLayoutModule, ...containerModules);
    launcher.configure(serverModule);
    try {
        return launcher.start({
            port: GLSP_SERVER_PORT,
            host: GLSP_SERVER_HOST
        });
    } catch (error) {
        logger.error('Error in GLSP server launcher:', error);
    }
}
/**
 * Custom module to bind language services so that they can be injected in other classes created through DI.
 *
 * @param services language services
 * @returns container module
 */
export function createLSPModule(services: UmlDiagramLSPServices): ContainerModule {
    return new ContainerModule(bind => {
        bind(UmlDiagramLSPServices).toConstantValue(services);
        bind(UmlDiagramSharedServices).toConstantValue(services.shared);
        bind(UmlDiagramServices).toConstantValue(services.language);
    });
}

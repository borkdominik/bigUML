/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { UmlDiagramServices, UmlDiagramSharedServices } from '@borkdominik-biguml/model-server';
import { UmlDiagramLSPServices } from '@borkdominik-biguml/model-server/integration';
import { configureELKLayoutModule } from '@eclipse-glsp/layout-elk';
import { LogLevel, LoggerFactory, type MaybePromise } from '@eclipse-glsp/server';
import { SocketServerLauncher, createAppModule, defaultLaunchOptions } from '@eclipse-glsp/server/node.js';
import { Container, ContainerModule } from 'inversify';
import { BigUmlServerModule } from './biguml-glsp-server.js';
import { LayeredLayoutConfigurator } from './common/layout/layered-layout-configurator.js';
import { ClassDiagramModule } from './diagrams/class-diagram/diagram/class-diagram-module.js';

const GLSP_SERVER_PORT = 5007;
const GLSP_SERVER_HOST = '127.0.0.1';

/**
 * Launches a GLSP server with access to the given language services on the default port.
 *
 * @param services language services
 * @returns a promise that is resolved as soon as the server is shut down or rejects if an error occurs
 */
export function startGLSPServer(services: UmlDiagramLSPServices, _workspaceFolders: any): MaybePromise<void> {
    const launchOptions = { ...defaultLaunchOptions, logLevel: LogLevel.debug };
    //     // create module based on launch options, e.g., logging etc.
    const appModule = createAppModule(launchOptions);
    //     // create custom module to bind language services to support injection within GLSP classes
    const lspModule = createLSPModule(services);
    //     // create app container will all necessary modules and retrieve launcher
    const appContainer = new Container();
    appContainer.load(appModule, lspModule);
    const logger = appContainer.get<LoggerFactory>(LoggerFactory)('BigUmlServer');
    const launcher = appContainer.resolve<SocketServerLauncher>(SocketServerLauncher);
    //     // use Eclipse Layout Kernel with our custom layered layout configuration
    const elkLayoutModule = configureELKLayoutModule({
        algorithms: ['layered'],
        layoutConfigurator: LayeredLayoutConfigurator
    });
    //     // create server module with our workflow model diagram
    const serverModule = new BigUmlServerModule().configureDiagramModule(new ClassDiagramModule(), elkLayoutModule);
    launcher.configure(serverModule);
    try {
        return launcher.start({
            ...launchOptions,
            port: GLSP_SERVER_PORT,
            host: GLSP_SERVER_HOST
        });
    } catch (error) {
        logger.error('Error in GLSP server launcher:', error);
    }
}
// /**
//  * Custom module to bind language services so that they can be injected in other classes created through DI.
//  *
//  * @param services language services
//  * @returns container module
//  */
export function createLSPModule(services: UmlDiagramLSPServices): ContainerModule {
    return new ContainerModule(bind => {
        bind(UmlDiagramLSPServices).toConstantValue(services);
        bind(UmlDiagramSharedServices).toConstantValue(services.shared);
        bind(UmlDiagramServices).toConstantValue(services.language);
    });
}

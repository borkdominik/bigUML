/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { LOGGER_CONFIG, LogLevel } from '@borkdominik-biguml/big-common';
import { UmlDiagramServices, UmlDiagramSharedServices } from '@borkdominik-biguml/uml-model-server';
import { UmlDiagramLSPServices } from '@borkdominik-biguml/uml-model-server/integration';
import { configureELKLayoutModule } from '@eclipse-glsp/layout-elk';
import { LogLevel as GlspLogLevel, LoggerFactory, type MaybePromise } from '@eclipse-glsp/server';
import { SocketServerLauncher, createAppModule, defaultLaunchOptions } from '@eclipse-glsp/server/node.js';
import { Container, ContainerModule } from 'inversify';
import { ClassDiagramModule } from './diagram/class/class-diagram-module.js';
import { FeatureDiagramModule } from './features/index.js';
import { LayeredLayoutConfigurator } from './features/layout/layered-layout-configurator.js';
import { UmlServerModule } from './module.js';

const GLSP_SERVER_PORT = 5007;
const GLSP_SERVER_HOST = '127.0.0.1';

export function fromCommonLogLevel(level: LogLevel): GlspLogLevel {
    switch (level) {
        case LogLevel.None:
            return GlspLogLevel.none;
        case LogLevel.Error:
            return GlspLogLevel.error;
        case LogLevel.Warn:
            return GlspLogLevel.warn;
        case LogLevel.Info:
            return GlspLogLevel.info;
        case LogLevel.Debug:
            return GlspLogLevel.debug;
        default:
            return GlspLogLevel.info;
    }
}

/**
 * Launches a GLSP server with access to the given language services on the default port.
 *
 * @param services language services
 * @returns a promise that is resolved as soon as the server is shut down or rejects if an error occurs
 */
export function startGLSPServer(services: UmlDiagramLSPServices, modules: (ContainerModule | FeatureDiagramModule)[]): MaybePromise<void> {
    const launchOptions = { ...defaultLaunchOptions, logLevel: fromCommonLogLevel(LOGGER_CONFIG.thirdParty.glspServer) };
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

    const classDiagramModule = new ClassDiagramModule();

    const containerModules: ContainerModule[] = [];
    for (const module of modules) {
        if (module instanceof FeatureDiagramModule) {
            classDiagramModule.addFeatureDiagramModule(module);
        } else {
            containerModules.push(module);
        }
    }

    const serverModule = new UmlServerModule().configureDiagramModule(classDiagramModule, elkLayoutModule, ...containerModules);
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

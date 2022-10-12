/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp;

import java.io.IOException;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.elk.alg.layered.options.LayeredMetaDataProvider;
import org.eclipse.emfcloud.modelserver.command.CCommandPackage;
import org.eclipse.glsp.layout.ElkLayoutEngine;
import org.eclipse.glsp.server.launch.SocketGLSPServerLauncher;
import org.eclipse.glsp.server.utils.LaunchUtil;

import com.eclipsesource.uml.glsp.core.UmlDiagramModule;
import com.eclipsesource.uml.glsp.core.UmlServerModule;

public class UmlGLSPServerLauncher {

   private static final Logger LOGGER = LogManager.getLogger(UmlGLSPServerLauncher.class.getSimpleName());

   private static final int DEFAULT_PORT = 5007;

   public static void main(final String[] args) {
      int port = getPort(args);
      ElkLayoutEngine.initialize(new LayeredMetaDataProvider());
      var module = new UmlServerModule().configureDiagramModule(new UmlDiagramModule());

      var launcher = new SocketGLSPServerLauncher(module);
      CCommandPackage.eINSTANCE.eClass();
      try {
         LaunchUtil.configureLogger(true, Level.DEBUG);
      } catch (IOException e) {
         e.printStackTrace();
      }
      launcher.start("localhost", port);
   }

   private static int getPort(final String[] args) {
      for (int i = 0; i < args.length; i++) {
         if ("--port".contentEquals(args[i])) {
            return Integer.parseInt(args[i + 1]);
         }
      }
      LOGGER.info("The server port was not specified; using default port 5007");
      return DEFAULT_PORT;
   }

}

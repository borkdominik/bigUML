/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp;

import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;
import org.eclipse.elk.alg.layered.options.LayeredMetaDataProvider;
import org.eclipse.glsp.layout.ElkLayoutEngine;
import org.eclipse.glsp.server.launch.DefaultGLSPServerLauncher;
import org.eclipse.glsp.server.launch.GLSPServerLauncher;

public class UmlGLSPServerLauncher {

   private static final Logger LOGGER = Logger.getLogger(UmlGLSPServerLauncher.class.getSimpleName());

   private static final int DEFAULT_PORT = 5007;

   public static void main(final String[] args) {
      int port = getPort(args);
      configureLogger();
      ElkLayoutEngine.initialize(new LayeredMetaDataProvider());
      GLSPServerLauncher launcher = new DefaultGLSPServerLauncher(new UmlGLSPModule());
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

   public static void configureLogger() {
      Logger root = Logger.getRootLogger();
      if (!root.getAllAppenders().hasMoreElements()) {
         root.addAppender(new ConsoleAppender(new PatternLayout(PatternLayout.TTCC_CONVERSION_PATTERN)));
      }
      root.setLevel(Level.INFO);
   }
}

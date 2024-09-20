/********************************************************************************
 * Copyright (c) 2021-2022 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.core.launch;

import java.util.function.Predicate;

import org.apache.commons.cli.ParseException;
import org.eclipse.elk.alg.layered.options.LayeredMetaDataProvider;
import org.eclipse.glsp.layout.ElkLayoutEngine;
import org.eclipse.glsp.server.launch.DefaultCLIParser;
import org.eclipse.glsp.server.launch.SocketGLSPServerLauncher;
import org.eclipse.glsp.server.utils.LaunchUtil;

import com.borkdominik.big.glsp.uml.core.UMLDiagramModule;
import com.borkdominik.big.glsp.uml.core.UMLMixinModule;

public class UMLServerLauncher {
   private static final int UML_DEFAULT_PORT = 5007;

   public static void main(final String[] args) {
      var processName = "UMLGLSPServer";
      try {
         ElkLayoutEngine.initialize(new LayeredMetaDataProvider());
         var parser = new DefaultCLIParser(args, processName);
         LaunchUtil.configure(parser);

         Predicate<Integer> validator = (port) -> LaunchUtil.isValidPort(port);
         int serverPort = parser.parseIntOption(DefaultCLIParser.OPTION_PORT, UML_DEFAULT_PORT, validator);

         var serverModule = new UMLServerModule()
               .configureDiagramModule(new UMLDiagramModule(), new UMLMixinModule());

         var launcher = new SocketGLSPServerLauncher(serverModule);
         launcher.start("localhost", serverPort);
      } catch (ParseException ex) {
         ex.printStackTrace();
         LaunchUtil.printHelp(processName, DefaultCLIParser.getDefaultOptions());
      }
   }
}

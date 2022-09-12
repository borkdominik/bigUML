/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
package com.eclipsesource.uml.modelserver;

import org.eclipse.emfcloud.modelserver.emf.launch.CLIBasedModelServerLauncher;
import org.eclipse.emfcloud.modelserver.emf.launch.CLIParser;
import org.eclipse.emfcloud.modelserver.emf.launch.ModelServerLauncher;

public class UmlModelServerLauncher {

   public static void main(final String[] args) {
      final ModelServerLauncher launcher = new CLIBasedModelServerLauncher(createCLIParser(args),
         new UmlModelServerModule());
      launcher.run();
   }

   protected static CLIParser createCLIParser(final String[] args) {
      CLIParser parser = new CLIParser(args, CLIParser.getDefaultCLIOptions(), "", 8081);
      return parser;
   }

}

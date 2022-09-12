/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.util;

import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.common.command.CompoundCommand;

public class UmlCommandUtil {

   private static Logger LOGGER = LogManager.getLogger(UmlCommandUtil.class.getSimpleName());

   private UmlCommandUtil() {

   }

   public static <T extends CompoundCommand> Optional<T> safeAppend(final CompoundCommand parent, final T command) {
      if (!command.isEmpty()) {
         parent.append(command);
         return Optional.of(command);
      }

      LOGGER.debug("Command " + command.getClass().getSimpleName() + " will be not appended to "
         + parent.getClass().getSimpleName());

      return Optional.empty();
   }
}

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
package com.eclipsesource.uml.modelserver.core.commands.noop;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.common.command.AbstractCommand;

public class NoopCommand extends AbstractCommand {
   private static Logger LOGGER = LogManager.getLogger(NoopCommand.class.getSimpleName());

   protected final String reason;

   public NoopCommand(final String reason) {
      super();
      this.reason = reason;
   }

   public NoopCommand() {
      super();
      this.reason = "";
   }

   @Override
   public void execute() {
      if (reason.isBlank()) {
         LOGGER.warn("NOOP executed");
      } else {
         LOGGER.warn("Reason for NOOP: " + reason);
      }
   }

   @Override
   public void redo() {}

}

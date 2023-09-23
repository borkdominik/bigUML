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
package com.eclipsesource.uml.modelserver.shared.codec.encoder;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;

public abstract class BaseEncoder implements CCommandProvider {
   protected final CCompoundCommand command;

   public BaseEncoder() {
      this.command = CCommandFactory.eINSTANCE.createCompoundCommand();
   }

   @Override
   public CCommand ccommand() {
      return command;
   }

   public CCompoundCommand ccompoundCommand() {
      return command;
   }
}

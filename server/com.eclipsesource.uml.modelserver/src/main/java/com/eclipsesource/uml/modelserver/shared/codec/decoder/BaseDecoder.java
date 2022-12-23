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
package com.eclipsesource.uml.modelserver.shared.codec.decoder;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.eclipsesource.uml.modelserver.shared.codec.ContextProvider;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class BaseDecoder implements CCommandProvider, ContextProvider {
   protected final CCommand command;
   protected final ModelContext context;

   protected BaseDecoder(final URI modelUri, final EditingDomain domain, final CCommand command) {
      this.command = command;
      this.context = ModelContext.of(modelUri, domain, command);
   }

   @Override
   public CCommand ccommand() {
      return command;
   }

   @Override
   public ModelContext context() {
      return context;
   }
}

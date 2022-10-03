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
package com.eclipsesource.uml.glsp.model;

import java.util.concurrent.CompletableFuture;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelServerAccess;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;

public class UmlModelServerAccess extends EMSNotationModelServerAccess {

   private static final Logger LOGGER = LogManager.getLogger(UmlModelServerAccess.class);

   /*
    * Renaming
    */
   public CompletableFuture<Response<String>> renameElement(final UmlModelState modelState,
      final NamedElement element, final String name) {

      CCommand renameameCommand = RenameElementCommandContribution.create(idGenerator.getOrCreateId(element),
         name);
      return this.edit(renameameCommand);
   }

   // ========= DIAGRAMS =========== //

   public CompletableFuture<Response<String>> exec(final CCommand command) {
      return super.edit(command);
   }
}

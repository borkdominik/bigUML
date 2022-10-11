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
import java.util.concurrent.ExecutionException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelServerAccess;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;
import com.eclipsesource.uml.modelserver.routing.UmlModelServerPaths;

public class UmlModelServerAccess extends EMSNotationModelServerAccess {

   private static final Logger LOGGER = LogManager.getLogger(UmlModelServerAccess.class);

   /*-
    * The whole communication between GLSP and ModelServer happens through the {@link
    * ModelServerPathParametersV2.FORMAT_JSON_V2 JSON_V2} format, however, we currently want to use our own format
    * {@link UmlCodec UmlCodec} for this specific case
    *
    * The reason is we want to access the resource of the EObject
    */
   @Override
   public EObject getSemanticModel() {
      try {
         return getModelServerClient().get(getSemanticURI(), UmlModelServerPaths.FORMAT_UML)
            .thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

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

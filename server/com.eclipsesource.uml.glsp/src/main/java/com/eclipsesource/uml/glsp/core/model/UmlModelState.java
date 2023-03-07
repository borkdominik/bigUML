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
package com.eclipsesource.uml.glsp.core.model;

import java.net.HttpURLConnection;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelState;
import org.eclipse.glsp.graph.GModelIndex;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.session.ClientSession;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;

public class UmlModelState extends EMSNotationModelState {
   private static final Logger LOGGER = LogManager.getLogger(UmlModelState.class);

   @Override
   public void sessionDisposed(final ClientSession clientSession) {
      if (this.semanticModel != null) {
         this.semanticModel = null;
         modelServerAccess.close().thenAccept(response -> {
            if (response.getStatusCode() == HttpURLConnection.HTTP_OK
               || response.getStatusCode() == HttpURLConnection.HTTP_NOT_FOUND) {
               LOGGER.debug("Disposing modelServer session succeeded");
            } else {
               LOGGER.error("Disposing modelServer session failed: " + response.getMessage());
            }
         });
         modelServerAccess.unsubscribe();
      }
      super.sessionDisposed(clientSession);
   }

   public Optional<UmlDiagram> getUmlNotationModel() { return super.getNotationModel(UmlDiagram.class); }

   public UmlDiagram getUnsafeUmlNotationModel() {
      var model = getUmlNotationModel()
         .orElseThrow(() -> new GLSPServerException("Could not access UML Notation Model"));

      return model;
   }

   public Optional<Representation> getRepresentation() {
      return this.getUmlNotationModel().map(diagram -> diagram.getRepresentation());
   }

   public Representation getUnsafeRepresentation() { return this.getUnsafeUmlNotationModel().getRepresentation(); }

   public boolean hasNotation(final EObject element) {
      return getIndex().getNotation(element).isPresent();
   }

   public boolean hasSemantic(final String elementId) {
      return getIndex().getEObject(elementId).isPresent();
   }

   @Override
   protected GModelIndex getOrUpdateIndex(final GModelRoot newRoot) {
      return UmlModelIndex.getOrCreate(getRoot(), semanticIdConverter);
   }
}

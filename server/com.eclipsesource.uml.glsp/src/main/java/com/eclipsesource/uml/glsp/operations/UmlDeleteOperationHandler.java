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
package com.eclipsesource.uml.glsp.operations;

import static org.eclipse.glsp.server.protocol.GLSPServerException.getOrThrow;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.protocol.GLSPServerException;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;

public class UmlDeleteOperationHandler extends ModelServerAwareBasicOperationHandler<DeleteOperation> {

   static Logger LOGGER = Logger.getLogger(UmlDeleteOperationHandler.class.getSimpleName());

   @Override
   public void executeOperation(final DeleteOperation operation, final GModelState graphicalModelState,
      final UmlModelServerAccess modelAccess) throws Exception {

      UmlModelState modelState = UmlModelState.getModelState(graphicalModelState);
      operation.getElementIds().forEach(elementId -> {

         EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         if (semanticElement instanceof Class) {
            modelAccess.removeClass(modelState, (Class) semanticElement).thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException(
                     "Could not execute delete operation on Class: " + semanticElement.toString());
               }
            });
         } else if (semanticElement instanceof Property) {
            modelAccess.removeProperty(modelState, (Property) semanticElement).thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException(
                     "Could not execute delete operation on Property: " + semanticElement.toString());
               }
            });
         } else if (semanticElement instanceof Association) {
            modelAccess.removeAssociation(modelState, (Association) semanticElement).thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException(
                     "Could not execute delete operation on Property: " + semanticElement.toString());
               }
            });
         }
      });
   }

}

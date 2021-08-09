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

import java.util.List;

import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.protocol.GLSPServerException;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;

public class CreateClassifierChildNodeOperationHandler
   extends ModelServerAwareBasicCreateOperationHandler<CreateNodeOperation> {

   public CreateClassifierChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = List.of(Types.PROPERTY);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final GModelState graphicalModelState,
      final UmlModelServerAccess modelAccess) throws Exception {
      UmlModelState modelState = UmlModelState.getModelState(graphicalModelState);

      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();

      PackageableElement container = getOrThrow(modelState.getIndex().getSemantic(containerId),
         PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");

      if (elementTypeId.equals(Types.PROPERTY) && container instanceof Class) {
         modelAccess.addProperty(UmlModelState.getModelState(modelState), (Class) container)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Property node");
               }
            });
      }

   }

   @Override
   public String getLabel() { return "Create Classifier child node"; }

}

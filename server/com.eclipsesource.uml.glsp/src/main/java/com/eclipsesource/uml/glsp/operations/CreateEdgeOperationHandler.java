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
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.protocol.GLSPServerException;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class CreateEdgeOperationHandler extends ModelServerAwareBasicCreateOperationHandler<CreateEdgeOperation> {

   public CreateEdgeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(Types.ASSOCIATION);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateEdgeOperation) {
         CreateEdgeOperation action = (CreateEdgeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   @Override
   public void executeOperation(final CreateEdgeOperation operation, final GModelState graphicalModelState,
      final UmlModelServerAccess modelAccess) throws Exception {
      String elementTypeId = operation.getElementTypeId();

      UmlModelState modelState = UmlModelState.getModelState(graphicalModelState);
      UmlModelIndex modelIndex = modelState.getIndex();

      Class sourceClass = getOrThrow(modelIndex.getSemantic(operation.getSourceElementId(), Class.class),
         "No semantic Class found for source element with id " + operation.getSourceElementId());
      Class targetClass = getOrThrow(modelIndex.getSemantic(operation.getTargetElementId(), Class.class),
         "No semantic Class found for target element with id" + operation.getTargetElementId());

      if (elementTypeId.equals(Types.ASSOCIATION)) {
         modelAccess.addAssociation(modelState, sourceClass, targetClass)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Association edge");
               }
            });
      }
   }

   @Override
   public String getLabel() { return "Create uml edge"; }

}

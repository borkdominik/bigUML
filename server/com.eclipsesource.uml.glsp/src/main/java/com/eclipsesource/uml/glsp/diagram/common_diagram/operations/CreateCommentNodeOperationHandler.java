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
package com.eclipsesource.uml.glsp.diagram.common_diagram.operations;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.diagram.common_diagram.constants.CommonTypes;
import com.google.common.collect.Lists;
import com.google.inject.Inject;

public class CreateCommentNodeOperationHandler
   extends AbstractEMSOperationHandler<CreateNodeOperation> {
   private static List<String> handledElementTypeIds = Lists.newArrayList(CommonTypes.COMMENT);

   @Inject
   protected UmlModelState modelState;

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation) {
      /*-
      
      if (!CommonTypes.COMMENT.equals(operation.getElementTypeId())) {
         throw new GLSPServerException("Unknown operation type for");
      }
      
      String objectId = operation.getContainerId();
      EObject container = getOrThrow(modelState.getIndex().getEObject(objectId),
         "No valid element with id " + objectId + " found");
      GPoint location = GraphUtil.point(0, 0);
      modelServerAccess.exec(AddCommentCommandContribution
         .create(location, EcoreUtil.getURI(container).fragment()))
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute create operation on new Comment node");
            }
         });
         */
   }

   @Override
   public String getLabel() { return "Create comment node"; }

}

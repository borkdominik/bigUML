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
package com.eclipsesource.uml.glsp.uml.common_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.uml.common_diagram.constants.CommonTypes;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.AddCommentCommandContribution;
import com.google.common.collect.Lists;

public class CreateCommentNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   public CreateCommentNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(CommonTypes.COMMENT);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final UmlModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();

      if (!CommonTypes.COMMENT.equals(operation.getElementTypeId())) {
         throw new GLSPServerException("Unknown operation type for");
      }

      String objectId = operation.getContainerId();
      EObject container = getOrThrow(modelState.getIndex().getSemantic(objectId),
         "No valid element with id " + objectId + " found");
      GPoint location = GraphUtil.point(0, 0);
      modelAccess.exec(AddCommentCommandContribution
         .create(location, EcoreUtil.getURI(container).fragment()))
         .thenAccept(response -> {
            if (!response.body()) {
               throw new GLSPServerException("Could not execute create operation on new Comment node");
            }
         });
   }

   @Override
   public String getLabel() { return "Create comment node"; }

}

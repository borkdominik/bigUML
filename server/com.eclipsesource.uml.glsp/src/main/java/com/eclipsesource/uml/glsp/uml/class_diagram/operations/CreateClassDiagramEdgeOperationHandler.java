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
package com.eclipsesource.uml.glsp.uml.class_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.class_diagram.ClassModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class CreateClassDiagramEdgeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateEdgeOperation, ClassModelServerAccess> {

   public CreateClassDiagramEdgeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(Types.ASSOCIATION,
      Types.AGGREGATION, Types.COMPOSITION, Types.CLASS_GENERALIZATION);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateEdgeOperation) {
         CreateEdgeOperation action = (CreateEdgeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateEdgeOperation operation, final ClassModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();

      String sourceId = operation.getSourceElementId();
      String targetId = operation.getTargetElementId();

      Class source = getOrThrow(modelState.getIndex().getSemantic(sourceId), Class.class,
         "No valid source comment with id " + sourceId + " found");
      Class target = getOrThrow(modelState.getIndex().getSemantic(targetId), Class.class,
         "No valid target element with id " + targetId + " found");

      System.out.println("ELEMENT TYPE ID " + operation.getElementTypeId());
      if (Types.ASSOCIATION.equals(operation.getElementTypeId()) ||
         Types.COMPOSITION.equals(operation.getElementTypeId()) ||
         Types.AGGREGATION.equals(operation.getElementTypeId())) {
         String keyword;
         if (Types.COMPOSITION.equals(operation.getElementTypeId())) {
            keyword = "composition";
         } else if (Types.AGGREGATION.equals(operation.getElementTypeId())) {
            keyword = "aggregation";
         } else {
            keyword = "association";
         }
         modelAccess.addAssociation(modelState, source, target, keyword)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Association edge");
               }
            });
      } else if (Types.CLASS_GENERALIZATION.equals(operation.getElementTypeId())) {
         System.out.println("REACHES EDGE HANDLER");
         System.out.println("source: " + source + " target: " + target);
         modelAccess.addClassGeneralization(modelState, source, target)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Generalisation edge");
               }
            });
      } else {
         System.out.println("Association could not be created!");
      }
   }

   @Override
   public String getLabel() { return "Create uml edge"; }

}

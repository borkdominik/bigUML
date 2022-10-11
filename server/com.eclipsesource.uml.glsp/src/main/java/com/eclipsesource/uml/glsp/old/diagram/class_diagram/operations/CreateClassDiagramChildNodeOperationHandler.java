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
package com.eclipsesource.uml.glsp.old.diagram.class_diagram.operations;

public class CreateClassDiagramChildNodeOperationHandler {
   /*-
   
   
   public CreateClassDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }
   
   private static List<String> handledElementTypeIds = List.of(ClassTypes.PROPERTY);
   
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
   public void executeOperation(final CreateNodeOperation operation, final ClassModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
   
      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();
   
      PackageableElement container = getOrThrow(modelState.getIndex().getEObject(containerId),
         PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");
   
      if (elementTypeId.equals(ClassTypes.PROPERTY) && container instanceof Class) {
         modelAccess.addProperty(UmlModelState.getModelState(modelState), (Class) container)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Property node");
               }
            });
      }
   
   }
   
   @Override
   public String getLabel() { return "Create Classifier child node"; }
   */
}

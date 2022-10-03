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

public class CreateClassDiagramNodeOperationHandler {
   /*-

   public CreateClassDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }
   
   private static final List<String> handledElementTypeIds = Lists.newArrayList(
      ClassTypes.CLASS, ClassTypes.INTERFACE, ClassTypes.ENUMERATION, ClassTypes.ABSTRACT_CLASS);
   
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
      boolean isAbstract = false;
      if (ClassTypes.CLASS.equals(operation.getElementTypeId())
         || ClassTypes.ABSTRACT_CLASS.equals(operation.getElementTypeId())) {
   
         if (ClassTypes.ABSTRACT_CLASS.equals(operation.getElementTypeId())) {
            isAbstract = true;
         }
         modelAccess.addClass(getUmlModelState(), operation.getLocation(), isAbstract)
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Class node");
               }
            });
      } else if (ClassTypes.INTERFACE.equals(operation.getElementTypeId())) {
         modelAccess.addInterface(getUmlModelState(), operation.getLocation())
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Interface node");
               }
            });
      } else if (ClassTypes.ENUMERATION.equals(operation.getElementTypeId())) {
         modelAccess.addEnumeration(getUmlModelState(), operation.getLocation())
            .thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException("Could not execute create operation on new Enumeration node");
               }
            });
      }
   }
   
   @Override
   public String getLabel() { return "Create uml classifier"; }
   */
}

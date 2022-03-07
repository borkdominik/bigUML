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
package com.eclipsesource.uml.glsp.operations.classdiagram;


import java.util.List;

import org.apache.log4j.Logger;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.eclipse.glsp.server.types.GLSPServerException;

public class CreateClassDiagramNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   public CreateClassDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   // private static List<String> handledElementTypeIds = Lists.newArrayList(Types.CLASS);

   private static Logger LOGGER = Logger.getLogger(CreateClassDiagramNodeOperationHandler.class);

   private static final List<String> handledElementTypeIds = Lists.newArrayList(
           Types.CLASS
   );

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() {
      return (UmlModelState) getEMSModelState();
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final UmlModelServerAccess modelAccess) {

      if (Types.CLASS.equals(operation.getElementTypeId())) {
         System.out.println("REACHES CLASS SWITCH");
         modelAccess.addClass(UmlModelState.getModelState(getUmlModelState()), operation.getLocation())
                 .thenAccept(response -> {
                    if (!response.body()) {
                       throw new GLSPServerException("Could not execute create operation on new Class node");
                    }
                 });
      }
   }

   @Override
   public String getLabel() { return "Create uml classifier"; }

}

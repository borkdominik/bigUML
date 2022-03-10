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
package com.eclipsesource.uml.glsp.operations.usecasediagram;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.apache.log4j.Logger;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import java.util.List;
import java.util.Optional;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateUseCaseDiagramNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   private static Logger LOGGER = Logger.getLogger(CreateUseCaseDiagramNodeOperationHandler.class);

   public CreateUseCaseDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   /**
    * The Types specified in this list will be processed by this file.
    * If a type is not mentioned here, the request for that type will not be redirected here.
    */
   private static List<String> handledElementTypeIds = Lists.newArrayList(Types.COMPONENT, Types.PACKAGE, Types.ACTOR,
      Types.USECASE, Types.COMMENT);

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

      UmlModelState modelState = getUmlModelState();

      switch (operation.getElementTypeId()) {
         case Types.PACKAGE: {
            modelAccess.addPackage(UmlModelState.getModelState(modelState), operation.getLocation())
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create operation on new Package node");
                  }
               });
            break;
         }
         case Types.COMPONENT: {
            PackageableElement container = null;
            try {
               container = getOrThrow(
                  UmlModelState.getModelState(modelState).getIndex().getSemantic(operation.getContainerId()),
                  PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");
            } catch (GLSPServerException ex) {
               LOGGER.error("Could not find container", ex);
            }
            if (container instanceof Model) {
               modelAccess.addComponent(UmlModelState.getModelState(modelState), operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Component node");
                     }
                  });
            } else if (container instanceof Package) {
               modelAccess
                  .addComponent(UmlModelState.getModelState(modelState), (Package) container,
                     operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Component node");
                     }
                  });
            }
            break;
         }
         case Types.ACTOR: {
            PackageableElement container = null;
            try {
               container = getOrThrow(
                  UmlModelState.getModelState(modelState).getIndex().getSemantic(operation.getContainerId()),
                  PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");
            } catch (GLSPServerException ex) {
               LOGGER.error("Could not find container", ex);
            }
            if (container != null && container instanceof Model) {
               modelAccess.addActor(UmlModelState.getModelState(modelState), operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Actor node");
                     }
                  });
            } /*else {
               modelAccess
                  .addActorInPackage(UmlModelState.getModelState(modelState), (Package) container,
                     operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new nested Actor node");
                     }
                  });
            }*/

            break;
         }
         case Types.USECASE: {
            PackageableElement container = null;
            try {
               container = getOrThrow(
                  UmlModelState.getModelState(modelState).getIndex().getSemantic(operation.getContainerId()),
                  PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");
            } catch (GLSPServerException ex) {
               LOGGER.error("Could not find container", ex);
            }
            if (container instanceof Model) {
               modelAccess.addUseCase(UmlModelState.getModelState(modelState), operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Usecase node");
                     }
                  });
            } else if (container instanceof Package || container instanceof Component) {
               modelAccess
                  .addUseCase(UmlModelState.getModelState(modelState), container,
                     operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new nested Usecase node");
                     }
                  });
            }
            break;
         }
      }
   }

   @Override
   public String getLabel() { return "Create uml classifier"; }

}

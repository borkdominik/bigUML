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
package com.eclipsesource.uml.glsp.old.diagram.deployment_diagram.operations;

public class CreateDeploymentDiagramNodeOperationHandler { /*-

   public CreateDeploymentDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(DeploymentTypes.DEPLOYMENT_NODE,
      DeploymentTypes.ARTIFACT,
      DeploymentTypes.EXECUTION_ENVIRONMENT, DeploymentTypes.DEVICE, DeploymentTypes.DEPLOYMENT_SPECIFICATION);

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
   public void executeOperation(final CreateNodeOperation operation, final DeploymentModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      switch (operation.getElementTypeId()) {
         case DeploymentTypes.DEPLOYMENT_NODE: {
            NamedElement parentContainer = getOrThrow(
               modelIndex.getEObject(operation.getContainerId(), NamedElement.class),
               "No parent container found!");
            if (parentContainer instanceof Model) {
               modelAccess.addNode(getUmlModelState(), operation.getLocation(), Model.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new deployment node");
                     }
                  });
            } else if (parentContainer instanceof Device || parentContainer instanceof ExecutionEnvironment
               || parentContainer instanceof Node) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess.addNode(getUmlModelState(), relativeLocation, Node.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new deployment node");
                     }
                  });
            }
            break;
         }
         case DeploymentTypes.ARTIFACT: {
            NamedElement parentContainer = getOrThrow(
               modelIndex.getEObject(operation.getContainerId(), NamedElement.class),
               "No parent container found!");
            if (parentContainer instanceof Model) {
               modelAccess.addArtifact(getUmlModelState(), operation.getLocation(), Model.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new deployment node");
                     }
                  });
            } else {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess.addArtifact(getUmlModelState(), relativeLocation, Artifact.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute create operation on new execution environment node");
                     }
                  });
            }
            break;
         }
         case DeploymentTypes.EXECUTION_ENVIRONMENT: {
            NamedElement parentContainer = getOrThrow(
               modelIndex.getEObject(operation.getContainerId(), NamedElement.class),
               "No container object was found");

            if (parentContainer instanceof Model) {
               modelAccess
                  .addExecutionEnvironment(getUmlModelState(), operation.getLocation(),
                     Model.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute create operation on new execution environment node");
                     }
                  });
            } else {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess
                  .addExecutionEnvironment(getUmlModelState(), relativeLocation,
                     ExecutionEnvironment.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException(
                           "Could not execute create operation on new execution environment node");
                     }
                  });
            }
            break;
         }
         case DeploymentTypes.DEVICE: {
            NamedElement parentContainer = getOrThrow(
               modelIndex.getEObject(operation.getContainerId(), NamedElement.class),
               "No container object was found");

            if (parentContainer instanceof Model) {
               modelAccess.addDevice(getUmlModelState(), operation.getLocation(), Model.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new device node");
                     }
                  });
            } else if (parentContainer instanceof Device || parentContainer instanceof Node) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess.addDevice(getUmlModelState(), relativeLocation, Device.class.cast(parentContainer))
                  .thenAccept(response -> {
                     if (response.body() == null || response.body().isEmpty()) {
                        throw new GLSPServerException("Could not execute create operation on new device node");
                     }
                  });
            }
            break;
         }
         case DeploymentTypes.DEPLOYMENT_SPECIFICATION: {
            String containerId = operation.getContainerId();

            PackageableElement container = getOrThrow(modelState.getIndex().getEObject(containerId),
               PackageableElement.class, "No valid container with id " + operation.getContainerId() + " found");

            Optional<GPoint> location = getDeploymentSpecificationPosition(modelState, container,
               operation.getLocation().orElse(GraphUtil.point(0, 0)));

            modelAccess.addDeploymentSpecification(modelState, location, container).thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException(
                     "Could not execute create operation on new DeploymentSpecification node");
               }
            });
            break;
         }
      }
   }

   protected Optional<GModelElement> getStructureCompartmentGModelElement(final Optional<GModelElement> container) {
      return container.filter(GNode.class::isInstance)
         .map(GNode.class::cast)
         .flatMap(this::getStructureCompartment);
   }

   protected Optional<GCompartment> getStructureCompartment(final GNode packageable) {
      return packageable.getChildren().stream().filter(GCompartment.class::isInstance).map(GCompartment.class::cast)
         .filter(comp -> DeploymentTypes.STRUCTURE.equals(comp.getType())).findFirst();
   }

   protected Optional<GPoint> getRelativeLocation(final CreateNodeOperation operation,
      final Optional<GPoint> absoluteLocation,
      final Optional<GModelElement> container) {
      if (absoluteLocation.isPresent() && container.isPresent()) {
         boolean allowNegativeCoordinates = container.get() instanceof GGraph;
         GModelElement modelElement = container.get();
         if (modelElement instanceof GBoundsAware) {
            try {
               GPoint relativePosition = GeometryUtil.absoluteToRelative(absoluteLocation.get(),
                  (GBoundsAware) modelElement);
               GPoint relativeLocation = allowNegativeCoordinates
                  ? relativePosition
                  : GraphUtil.point(Math.max(0, relativePosition.getX()), Math.max(0, relativePosition.getY()));
               return Optional.of(relativeLocation);
            } catch (IllegalArgumentException ex) {
               return absoluteLocation;
            }
         }
      }
      return Optional.empty();
   }

   private Optional<GPoint> getDeploymentSpecificationPosition(final UmlModelState modelState,
      final PackageableElement container, final GPoint position) {

      if (container instanceof Artifact || container instanceof Node) {
         Shape containerShape = modelState.getIndex().getNotation(container, Shape.class).get();
         double x = position.getX();
         double y = position.getY();

         x = Math.max(0, x - containerShape.getPosition().getX());
         y = Math.max(0, y - containerShape.getPosition().getY() - 43);

         return Optional.of(GraphUtil.point(x - 16, y - 8));
      }
      return Optional.of(position);
   }

   @Override
   public String getLabel() { return "Create uml classifier"; }
   */
}

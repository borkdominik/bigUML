package com.eclipsesource.uml.glsp.uml.deployment_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.DeploymentModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.collect.Lists;

public class CreateDeploymentDiagramChildNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, DeploymentModelServerAccess> {

   public CreateDeploymentDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
      UmlConfig.Types.DEPLOYMENT_COMPONENT);

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
      String containerId = operation.getContainerId();
      NamedElement container = getOrThrow(modelState.getIndex().getSemantic(containerId), NamedElement.class,
         "No valid container with id " + containerId + " found");
      System.out.println("CONTAINER " + container.getLabel());
      String elementTypeId = operation.getElementTypeId();
      // GPoint location = getPosition(modelState, container, operation.getLocation().orElse(GraphUtil.point(0, 0)));
      GPoint location = getPosition(modelState, container, GraphUtil.point(0, 0));

      if (Types.DEPLOYMENT_COMPONENT.equals(elementTypeId)) {
         modelAccess.addDeploymentComponent(modelState, location, container)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new Component node");
               }
            });
      }

   }

   private GPoint getPosition(final UmlModelState modelState, final Element container, final GPoint position) {
      Shape containerShape = modelState.getIndex().getNotation(container, Shape.class).get();
      double x = position.getX();
      double y = position.getY();
      x = Math.max(0, x - containerShape.getPosition().getX());
      y = Math.max(0, y - containerShape.getPosition().getY() - 43);

      if (container instanceof Device) {
         return GraphUtil.point(x, y);
      }
      return GraphUtil.point(0, 0);
   }

   @Override
   public String getLabel() { return "Create deployment child node"; }
}

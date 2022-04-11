package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Diagram;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.*;

import java.util.stream.Collectors;

public class UmlDeploymentDiagramModelFactory extends DiagramFactory {

   public UmlDeploymentDiagramModelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      GModelElement result = null;
      if (semanticElement instanceof Model) {
         result = create(semanticElement);
      }  // handling the relationships
      else if (semanticElement instanceof CommunicationPath) {
         result = deploymentEdgeFactory.create((CommunicationPath) semanticElement);
      } else if (semanticElement instanceof Deployment) {
         result = deploymentEdgeFactory.create((Deployment) semanticElement);
      } else if (semanticElement instanceof Device) {
         result = deploymentNodeFactory.create((Device) semanticElement);
      } else if (semanticElement instanceof ExecutionEnvironment) {
         result = deploymentNodeFactory.create((ExecutionEnvironment) semanticElement);
      } else if (semanticElement instanceof Node) {
         result = deploymentNodeFactory.create((Node) semanticElement);
      } else if (semanticElement instanceof DeploymentSpecification) {
         result = deploymentNodeFactory.create((DeploymentSpecification) semanticElement);
      } else if (semanticElement instanceof Artifact) {
         result = deploymentNodeFactory.create((Artifact) semanticElement);
      } else if (semanticElement instanceof Component) {
         result = deploymentChildNodeFactory.create((Component) semanticElement);
      }
      if (result == null) {
         throw createFailed(semanticElement);
      }
      return result;
   }

   @Override
   public GGraph create(final Diagram umlDiagram) {
      GGraph graph = getOrCreateRoot();

      if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
         Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();

         graph.setId(toId(umlModel));

         graph.getChildren().addAll(umlModel.getPackagedElements().stream() //
               .filter(Node.class::isInstance)//
               .map(Node.class::cast)//
               .map(this::create)//
               .collect(Collectors.toList()));

         graph.getChildren().addAll(umlModel.getPackagedElements().stream() //
               .filter(Artifact.class::isInstance)//
               .map(Artifact.class::cast)//
               .map(this::create)//
               .collect(Collectors.toList()));

         graph.getChildren().addAll(umlModel.getPackagedElements().stream()
               .filter(CommunicationPath.class::isInstance)
               .map(CommunicationPath.class::cast)
               .map(this::create)
               .collect(Collectors.toList()));

         graph.getChildren().addAll(umlModel.getPackagedElements().stream()
               .filter(Deployment.class::isInstance)
               .map(Deployment.class::cast)
               .map(this::create)
               .collect(Collectors.toList()));

         graph.getChildren().addAll(umlModel.getPackagedElements().stream()
               .filter(Component.class::isInstance)
               .map(Component.class::cast)
               .map(this::create)
               .collect(Collectors.toList()));

            /*graph.getChildren().addAll(umlModel.getPackagedElements().stream() //
                    .filter(Device.class::isInstance)//
                    .map(Device.class::cast)//
                    .map(this::create)//
                    .collect(Collectors.toList()));*/

            /*graph.getChildren().addAll(umlModel.getPackagedElements().stream() //
                    .filter(ExecutionEnvironment.class::isInstance)//
                    .map(ExecutionEnvironment.class::cast)//
                    .map(this::create)//
                    .collect(Collectors.toList()));*/

            /*graph.getChildren().addAll(umlModel.getPackagedElements().stream() //
                    .filter(DeploymentSpecification.class::isInstance)//
                    .map(DeploymentSpecification.class::cast)//
                    .map(this::create)//
                    .collect(Collectors.toList()));*/

            /*graph.getChildren().addAll(umlModel.getPackagedElements().stream() //
                    .filter(CommunicationPath.class::isInstance)//
                    .map(CommunicationPath.class::cast)//
                    .map(this::create)//
                    .collect(Collectors.toList()));*/
      }
      return graph;
   }
}

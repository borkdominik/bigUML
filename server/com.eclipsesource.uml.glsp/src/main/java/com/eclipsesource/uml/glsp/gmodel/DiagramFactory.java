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
package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Diagram;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.builder.impl.GGraphBuilder;
import org.eclipse.glsp.server.types.GLSPServerException;

public abstract class DiagramFactory extends AbstractGModelFactory<EObject, GModelElement> {

   protected final CommentFactory commentFactory;
   protected final LabelFactory labelFactory;
   protected final CompartmentLabelFactory compartmentLabelFactory;

   protected final ClassDiagramNodeFactory classDiagramNodeFactory;
   protected final ClassDiagramEdgeFactory classDiagramEdgeFactory;

   protected final ActivityDiagramChildNodeFactory activityChildNodeFactory;
   protected final ActivityDiagramNodeFactory activityNodeFactory;
   protected final ActivityDiagramEdgeFactory activityDiagramEdgeFactory;
   protected final ActivityDiagramGroupNodeFactory activityGroupNodeFactory;

   protected final UseCaseDiagramNodeFactory useCaseNodeFactory;
   protected final UseCaseDiagramEdgeFactory useCaseEdgeFactory;
   //TODO
   //protected final UseCaseDiagramChildNodeFactory useCaseDiagramChildNodeFactory;

   protected final StateMachineDiagramNodeFactory stateMachineNodeFactory;
   protected final StateMachineDiagramVertexFactory stateMachineDiagramVertexFactory;
   protected final StateMachineDiagramEdgeFactory stateMachineEdgeFactory;
   protected final RegionCompartmentFactory regionCompartmentFactory;
   protected final StateMachineDiagramPortFactory stateMachinePortFactory;

   protected final DeploymentDiagramNodeFactory deploymentNodeFactory;
   protected final DeploymentDiagramChildNodeFactory deploymentChildNodeFactory;
   protected final DeploymentDiagramEdgeFactory deploymentEdgeFactory;

   protected final ObjectDiagramNodeFactory objectDiagramNodeFactory;
   protected final ObjectDiagramEdgeFactory objectDiagramEdgeFactory;


   public DiagramFactory(final UmlModelState modelState) {
      super(modelState);
      // COMMONS
      labelFactory = new LabelFactory(modelState);
      commentFactory = new CommentFactory(modelState);
      compartmentLabelFactory = new CompartmentLabelFactory(modelState);
      // CLASS
      classDiagramNodeFactory = new ClassDiagramNodeFactory(modelState, compartmentLabelFactory);
      classDiagramEdgeFactory = new ClassDiagramEdgeFactory(modelState);
      //OBJECT
      objectDiagramNodeFactory = new ObjectDiagramNodeFactory(modelState, labelFactory);
      objectDiagramEdgeFactory = new ObjectDiagramEdgeFactory(modelState);
      // ACTIVITY
      activityChildNodeFactory = new ActivityDiagramChildNodeFactory(modelState);
      activityDiagramEdgeFactory = new ActivityDiagramEdgeFactory(modelState);
      activityGroupNodeFactory = new ActivityDiagramGroupNodeFactory(modelState, this);
      activityNodeFactory = new ActivityDiagramNodeFactory(modelState, this,
            activityChildNodeFactory, activityGroupNodeFactory);
      // USECASE
      useCaseNodeFactory = new UseCaseDiagramNodeFactory(modelState, labelFactory);
      useCaseEdgeFactory = new UseCaseDiagramEdgeFactory(modelState);
      //useCaseDiagramChildNodeFactory = new UseCaseDiagramChildNodeFactory(modelState, labelFactory, this);
      // STATEMACHINE
      stateMachineNodeFactory = new StateMachineDiagramNodeFactory(modelState, labelFactory, this);
      stateMachineDiagramVertexFactory = new StateMachineDiagramVertexFactory(modelState);
      stateMachineEdgeFactory = new StateMachineDiagramEdgeFactory(modelState);
      regionCompartmentFactory = new RegionCompartmentFactory(modelState, this);
      stateMachinePortFactory = new StateMachineDiagramPortFactory(modelState);
      // DEPLOYMENT
      deploymentNodeFactory = new DeploymentDiagramNodeFactory(modelState, this);
      deploymentChildNodeFactory = new DeploymentDiagramChildNodeFactory(modelState);
      deploymentEdgeFactory = new DeploymentDiagramEdgeFactory(modelState);

      getOrCreateRoot();
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      // no-op as we focus on create(final Diagram umlDiagram)
      return null;
   }

   public abstract GGraph create(final Diagram umlDiagram);

   public GGraph create() {
      return create(modelState.getNotationModel());
   }

   public static GLSPServerException createFailed(final EObject semanticElement) {
      return new GLSPServerException("Error during model initialization!", new Throwable(
            "No matching GModelElement found for the semanticElement of type: " + semanticElement.getClass()));
   }

   protected GGraph getOrCreateRoot() {
      GModelRoot existingRoot = modelState.getRoot();
      if (existingRoot != null && existingRoot instanceof GGraph) {
         GGraph graph = (GGraph) existingRoot;
         graph.getChildren().clear();
         return graph;
      }
      return createRoot(modelState);
   }

   public GGraph createRoot(final UmlModelState modelState) {
      GGraph graph = new GGraphBuilder().build();
      modelState.setRoot(graph);
      return graph;
   }
}

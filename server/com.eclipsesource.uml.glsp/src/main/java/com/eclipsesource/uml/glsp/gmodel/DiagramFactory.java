/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.builder.impl.GGraphBuilder;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.activity_diagram.gmodel.ActivityDiagramChildNodeFactory;
import com.eclipsesource.uml.glsp.uml.activity_diagram.gmodel.ActivityDiagramEdgeFactory;
import com.eclipsesource.uml.glsp.uml.activity_diagram.gmodel.ActivityDiagramGroupNodeFactory;
import com.eclipsesource.uml.glsp.uml.activity_diagram.gmodel.ActivityDiagramNodeFactory;
import com.eclipsesource.uml.glsp.uml.class_diagram.gmodel.ClassDiagramEdgeFactory;
import com.eclipsesource.uml.glsp.uml.class_diagram.gmodel.ClassDiagramNodeFactory;
import com.eclipsesource.uml.glsp.uml.common_diagram.gmodel.CommentFactory;
import com.eclipsesource.uml.glsp.uml.communication_diagram.gmodel.CommunicationInteractionNodeFactory;
import com.eclipsesource.uml.glsp.uml.communication_diagram.gmodel.CommunicationLifelineNodeFactory;
import com.eclipsesource.uml.glsp.uml.communication_diagram.gmodel.CommunicationMessageEdgeFactory;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel.DeploymentDiagramChildNodeFactory;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel.DeploymentDiagramEdgeFactory;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel.DeploymentDiagramNodeFactory;
import com.eclipsesource.uml.glsp.uml.object_diagram.gmodel.ObjectDiagramEdgeFactory;
import com.eclipsesource.uml.glsp.uml.object_diagram.gmodel.ObjectDiagramNodeFactory;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel.RegionCompartmentFactory;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel.StateMachineDiagramEdgeFactory;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel.StateMachineDiagramNodeFactory;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel.StateMachineDiagramPortFactory;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel.StateMachineDiagramVertexFactory;
import com.eclipsesource.uml.glsp.uml.usecase_diagram.gmodel.UseCaseDiagramEdgeFactory;
import com.eclipsesource.uml.glsp.uml.usecase_diagram.gmodel.UseCaseDiagramNodeFactory;
import com.eclipsesource.uml.modelserver.unotation.Diagram;

public abstract class DiagramFactory extends AbstractGModelFactory<EObject, GModelElement> {

   public final CommentFactory commentFactory;
   public final LabelFactory labelFactory;
   public final CompartmentLabelFactory compartmentLabelFactory;

   public final ClassDiagramNodeFactory classDiagramNodeFactory;
   public final ClassDiagramEdgeFactory classDiagramEdgeFactory;

   public final ActivityDiagramChildNodeFactory activityChildNodeFactory;
   public final ActivityDiagramNodeFactory activityNodeFactory;
   public final ActivityDiagramEdgeFactory activityDiagramEdgeFactory;
   public final ActivityDiagramGroupNodeFactory activityGroupNodeFactory;

   public final UseCaseDiagramNodeFactory useCaseNodeFactory;
   public final UseCaseDiagramEdgeFactory useCaseEdgeFactory;
   // TODO
   // protected final UseCaseDiagramChildNodeFactory
   // useCaseDiagramChildNodeFactory;

   public final StateMachineDiagramNodeFactory stateMachineNodeFactory;
   public final StateMachineDiagramVertexFactory stateMachineDiagramVertexFactory;
   public final StateMachineDiagramEdgeFactory stateMachineEdgeFactory;
   public final RegionCompartmentFactory regionCompartmentFactory;
   public final StateMachineDiagramPortFactory stateMachinePortFactory;

   public final DeploymentDiagramNodeFactory deploymentNodeFactory;
   public final DeploymentDiagramChildNodeFactory deploymentChildNodeFactory;
   public final DeploymentDiagramEdgeFactory deploymentEdgeFactory;

   public final ObjectDiagramNodeFactory objectDiagramNodeFactory;
   public final ObjectDiagramEdgeFactory objectDiagramEdgeFactory;

   public final CommunicationInteractionNodeFactory interactionNodeFactory;
   public final CommunicationLifelineNodeFactory lifelineNodeFactory;
   public final CommunicationMessageEdgeFactory messageEdgeFactory;

   public DiagramFactory(final UmlModelState modelState) {
      super(modelState);
      // COMMONS
      labelFactory = new LabelFactory(modelState);
      commentFactory = new CommentFactory(modelState);
      compartmentLabelFactory = new CompartmentLabelFactory(modelState);
      // CLASS
      classDiagramNodeFactory = new ClassDiagramNodeFactory(modelState, compartmentLabelFactory);
      classDiagramEdgeFactory = new ClassDiagramEdgeFactory(modelState);
      // OBJECT
      objectDiagramNodeFactory = new ObjectDiagramNodeFactory(modelState, labelFactory);
      objectDiagramEdgeFactory = new ObjectDiagramEdgeFactory(modelState);
      // ACTIVITY
      activityChildNodeFactory = new ActivityDiagramChildNodeFactory(modelState);
      activityDiagramEdgeFactory = new ActivityDiagramEdgeFactory(modelState);
      activityGroupNodeFactory = new ActivityDiagramGroupNodeFactory(modelState, this,
         activityChildNodeFactory);
      activityNodeFactory = new ActivityDiagramNodeFactory(modelState, this,
         activityChildNodeFactory);
      // USECASE
      useCaseNodeFactory = new UseCaseDiagramNodeFactory(modelState, labelFactory);
      useCaseEdgeFactory = new UseCaseDiagramEdgeFactory(modelState);
      // useCaseDiagramChildNodeFactory = new
      // UseCaseDiagramChildNodeFactory(modelState, labelFactory, this);
      // STATEMACHINE
      stateMachineNodeFactory = new StateMachineDiagramNodeFactory(modelState, labelFactory, this);
      stateMachineDiagramVertexFactory = new StateMachineDiagramVertexFactory(modelState, stateMachineNodeFactory);
      stateMachineEdgeFactory = new StateMachineDiagramEdgeFactory(modelState);
      regionCompartmentFactory = new RegionCompartmentFactory(modelState, this);
      stateMachinePortFactory = new StateMachineDiagramPortFactory(modelState);
      // DEPLOYMENT
      deploymentNodeFactory = new DeploymentDiagramNodeFactory(modelState, this);
      deploymentChildNodeFactory = new DeploymentDiagramChildNodeFactory(modelState);
      deploymentEdgeFactory = new DeploymentDiagramEdgeFactory(modelState);

      // Communication
      interactionNodeFactory = new CommunicationInteractionNodeFactory(modelState, this);
      lifelineNodeFactory = new CommunicationLifelineNodeFactory(modelState, compartmentLabelFactory);
      messageEdgeFactory = new CommunicationMessageEdgeFactory(modelState);
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

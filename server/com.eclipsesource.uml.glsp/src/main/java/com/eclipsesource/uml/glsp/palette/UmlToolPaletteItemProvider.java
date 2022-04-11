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
package com.eclipsesource.uml.glsp.palette;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;
import org.apache.log4j.Logger;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.operations.CreateNodeOperation;

import java.util.List;
import java.util.Map;

public class UmlToolPaletteItemProvider extends EMSBasicOperationHandler<CreateNodeOperation, UmlModelServerAccess>
      implements ToolPaletteItemProvider {

   private static Logger LOGGER = Logger.getLogger(UmlToolPaletteItemProvider.class.getSimpleName());

   protected UmlModelState getUmlModelState() {
      return (UmlModelState) getEMSModelState();
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {

      Representation diagramType = UmlModelState.getModelState(getUmlModelState()).getNotationModel().getDiagramType();
      System.out.println("------- CURRENT DIAGRAM TYPE: " + diagramType + " ----------");

      List<PaletteItem> activityDiagram = Lists.newArrayList(classifiersActivity(), featuresActivity(),
            relationsActivity(), controlNodesActivity(), dataActivity(), annotations(), comment());

      List<PaletteItem> classDiagram = Lists.newArrayList(classifiersClass(), relationsClass(), featuresClass(), comment());

      List<PaletteItem> objectDiagram = Lists.newArrayList(classifiersObject(), relationsObject(), featuresObject());

      List<PaletteItem> deploymentDiagram = Lists.newArrayList(classifiersDeployment(), relationsDeployment(), comment());

      List<PaletteItem> useCaseDiagram = Lists.newArrayList(classifiersUseCase(), relationsUseCase(), comment());

      List<PaletteItem> stateMachineDiagram = Lists.newArrayList(classifiersStateMachine(), behaviourStateMachine(),
            relationsStateMachine(), comment());

      LOGGER.info("Create palette");

      List<PaletteItem> finalPalette = null;
      if (diagramType == Representation.CLASS) {
         finalPalette = classDiagram;
      } else if (diagramType == Representation.ACTIVITY) {
         finalPalette = activityDiagram;
      } else if (diagramType == Representation.DEPLOYMENT) {
         finalPalette = deploymentDiagram;
      } else if (diagramType == Representation.STATEMACHINE) {
         finalPalette = stateMachineDiagram;
      } else if (diagramType == Representation.USECASE) {
         finalPalette = useCaseDiagram;
      } else if (diagramType == Representation.OBJECT) {
         finalPalette = objectDiagram;
      }
      return finalPalette;
   }

   private PaletteItem classifiersClass() {
      PaletteItem createClass = node(Types.CLASS, "Class", "umlclass");

      List<PaletteItem> classifiers = Lists.newArrayList(createClass);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsClass() {
      PaletteItem createAssociation = edge(Types.ASSOCIATION, "Association", "umlassociation");

      List<PaletteItem> relations = Lists.newArrayList(createAssociation);
      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem featuresClass() {
      PaletteItem createProperty = node(Types.PROPERTY, "Property", "umlproperty");

      List<PaletteItem> features = Lists.newArrayList(createProperty);
      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }

   private PaletteItem classifiersObject() {
      PaletteItem createObject = node(Types.OBJECT, "Object", "umlobject");

      List<PaletteItem> classifiers = Lists.newArrayList(createObject);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsObject() {
      PaletteItem createLink = edge(Types.LINK, "Link", "umlassociation");

      List<PaletteItem> relations = Lists.newArrayList(createLink);
      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem featuresObject() {
      PaletteItem createAttribute = node(Types.ATTRIBUTE, "Attribute", "umlproperty");

      List<PaletteItem> features = Lists.newArrayList(createAttribute);
      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }

   private PaletteItem classifiersActivity() {
      PaletteItem createActivity = node(Types.ACTIVITY, "Activity", "umlactivity");
      PaletteItem createPartition = node(Types.PARTITION, "Partition", "umlpartition");
      PaletteItem region = node(Types.INTERRUPTIBLEREGION, "Interruptible Region", "umlinterruptibleregion");

      List<PaletteItem> classifiers = Lists.newArrayList(createActivity, createPartition, region);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsActivity() {
      PaletteItem createControlFlor = edge(Types.CONTROLFLOW, "Control Flow", "umlcontrolflow");
      PaletteItem exceptionHandler = edge(Types.EXCEPTIONHANDLER, "Exception Handler", "umlexceptionhandler");

      List<PaletteItem> edges = Lists.newArrayList(createControlFlor, exceptionHandler);
      return PaletteItem.createPaletteGroup("uml.relation", "Flow", edges, "symbol-property");
   }

   private PaletteItem featuresActivity() {
      PaletteItem createOpaque = node(Types.ACTION, "Action", "umlaction");
      PaletteItem createAcceptEvent = node(Types.ACCEPTEVENT, "Event", "umlevent");
      PaletteItem createTimeEvent = node(Types.TIMEEVENT, "Time Event", "umltime");
      PaletteItem createSendSignal = node(Types.SENDSIGNAL, "Signal", "umlsignal");
      PaletteItem createCall = node(Types.CALL, "Call", "umlcall");

      List<PaletteItem> features = Lists.newArrayList(createOpaque, createAcceptEvent, createTimeEvent,
            createSendSignal, createCall);

      return PaletteItem.createPaletteGroup("uml.feature", "Actions", features, "symbol-property");
   }

   private PaletteItem annotations() {
      // ACTIVITY
      PaletteItem precondition = node(Types.CONDITION, "Condition", "umlcondition");

      List<PaletteItem> features = Lists.newArrayList(precondition);

      return PaletteItem.createPaletteGroup("uml.feature", "Annotations", features, "symbol-property");
   }

   private PaletteItem dataActivity() {
      // ACTIVITY
      PaletteItem par = node(Types.PARAMETER, "Parameter", "umlparameter");
      PaletteItem pin = node(Types.PIN, "Pin", "umlpin");
      PaletteItem cb = node(Types.CENTRALBUFFER, "Central Buffer", "umlcentralbuffer");
      PaletteItem ds = node(Types.DATASTORE, "Datastore", "umldatastore");

      List<PaletteItem> features = Lists.newArrayList(par, pin, cb, ds);

      return PaletteItem.createPaletteGroup("uml.feature", "Data", features, "symbol-property");
   }

   private PaletteItem controlNodesActivity() {

      List<PaletteItem> controlNodes = Lists.newArrayList(
            node(Types.INITIALNODE, "Initial", "umlinitial"),
            node(Types.FINALNODE, "Final", "umlfinal"),
            node(Types.FLOWFINALNODE, "Flow Final", "umlflowfinal"),
            node(Types.DECISIONMERGENODE, "Decision/Merge", "umldecision"),
            node(Types.FORKJOINNODE, "Fork/Join", "umlfork"));

      return PaletteItem.createPaletteGroup("uml.feature", "Control Nodes", controlNodes, "symbol-property");
   }

   private PaletteItem classifiersUseCase() {
      PaletteItem createUseCase = node(Types.USECASE, "Use Case", "umlusecase");
      PaletteItem createPackage = node(Types.PACKAGE, "Package", "umlpackage");
      PaletteItem createComponent = node(Types.COMPONENT, "Component", "umlcomponent");
      PaletteItem createActor = node(Types.ACTOR, "Actor", "umlactor");

      List<PaletteItem> classifiers = Lists.newArrayList(createUseCase, createPackage, createComponent, createActor);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsUseCase() {
      PaletteItem createExtend = edge(Types.EXTEND, "Extend", "umlextend");
      PaletteItem createInclude = edge(Types.INCLUDE, "Include", "umlinclude");
      PaletteItem createGeneralization = edge(Types.GENERALIZATION, "Generalization", "umlgeneralization");
      PaletteItem createAssociation = edge(Types.USECASE_ASSOCIATION, "Association", "umlassociation");

      List<PaletteItem> relations = Lists.newArrayList(createExtend, createInclude, createGeneralization, createAssociation);
      return PaletteItem.createPaletteGroup("uml.relation", "Relations", relations, "symbol-property");
   }

   private PaletteItem classifiersDeployment() {
      PaletteItem createDeploymentNode = node(Types.DEPLOYMENT_NODE, "Node", "umldeploymentnode");
      PaletteItem createArtifact = node(Types.ARTIFACT, "Artifact", "umlartifact");
      PaletteItem createDevice = node(Types.DEVICE, "Device", "umldevice");
      PaletteItem createExecutionEnvironment = node(Types.EXECUTION_ENVIRONMENT, "Execution Environment",
            "umlexecutionenvironment");
      PaletteItem createDeploymentSpecification = node(Types.DEPLOYMENT_SPECIFICATION, "Deployment Specification",
            "umldeploymentspecification");
      PaletteItem createComponent = node(Types.DEPLOYMENT_COMPONENT, "Component", "umlcomponent");

      List<PaletteItem> classifiers = Lists.newArrayList(
            createDeploymentNode, createArtifact, createDevice, createExecutionEnvironment,
            createDeploymentSpecification, createComponent
      );
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsDeployment() {
      PaletteItem createCommunicationPath = edge(Types.COMMUNICATION_PATH, "Communication Path",
            "umlcommunicationpath");
      PaletteItem createDeployment = edge(Types.DEPLOYMENT, "Deployment", "umldeployment");

      List<PaletteItem> relations = Lists.newArrayList(createCommunicationPath, createDeployment);
      return PaletteItem.createPaletteGroup("uml.relation", "Relations", relations, "symbol-property");
   }

   private PaletteItem classifiersStateMachine() {
      PaletteItem createStateMachine = node(Types.STATE_MACHINE, "State Machine", "umlstatemachine");
      PaletteItem createState = node(Types.STATE, "State", "umlstate");
      PaletteItem createFinalState = node(Types.FINAL_STATE, "Final State", "umlfinalstate");

      //Pseudo States
      PaletteItem createInitialState = node(Types.INITIAL_STATE, "Initial", "umlinitialstate");
      PaletteItem createDeepHistory = node(Types.DEEP_HISTORY, "DeepHistory", "umldeephistory");
      PaletteItem createShallowHistory = node(Types.SHALLOW_HISTORY, "ShallowHistory", "umlshallowhistory");
      PaletteItem createFork = node(Types.FORK, "Fork", "umlfork");
      PaletteItem createJoin = node(Types.JOIN, "Join", "umljoin");
      PaletteItem createJunction = node(Types.JUNCTION, "Junction", "umljunction");
      PaletteItem createChoice = node(Types.CHOICE, "Choice", "umlchoice");
      // FIXME: entry and exit renders are changed!
      PaletteItem createEntryPoint = node(Types.EXIT_POINT, "Entry Point", "umlentrypoint");
      PaletteItem createExitPoint = node(Types.ENTRY_POINT, "Exit Point", "umlexitpoint");

      List<PaletteItem> classifiers = Lists.newArrayList(
            createStateMachine, createState, createFinalState, createChoice, createFork, createInitialState,
            createJoin, createJunction, createDeepHistory, createShallowHistory, createEntryPoint, createExitPoint
      );
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem behaviourStateMachine() {
      PaletteItem createEntryActivity = node(Types.STATE_ENTRY_ACTIVITY, "State Entry Activity",
            "umlstateactivity");
      PaletteItem createDoActivity = node(Types.STATE_DO_ACTIVITY, "State Do Activity",
            "umlstateactivity");
      PaletteItem createExitActivity = node(Types.STATE_EXIT_ACTIVITY, "State Exit Activity",
            "umlstateactivity");

      List<PaletteItem> behaviour = Lists.newArrayList(
            createEntryActivity, createDoActivity, createExitActivity
      );
      return PaletteItem.createPaletteGroup("uml.feature", "Behaviour", behaviour, "symbol-property");
   }

   private PaletteItem relationsStateMachine() {
      PaletteItem createTransition = edge(Types.TRANSITION, "Transition", "umltransition");

      List<PaletteItem> relations = Lists.newArrayList(createTransition);
      return PaletteItem.createPaletteGroup("uml.relation", "Relations", relations, "symbol-property");
   }

   private PaletteItem comment() {
      PaletteItem createCommentNode = node(Types.COMMENT, "Comment", "umlcomment");
      // PaletteItem createCommentEdge = node(Types.COMMENT_EDGE, "Comment Edge", "umlcommentedge");

      List<PaletteItem> comment = Lists.newArrayList(createCommentNode);
      return PaletteItem.createPaletteGroup("uml.comment", "Comment", comment, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

   // just part of the workaround which was used to get the current diagram type
   @Override
   public void executeOperation(CreateNodeOperation createNodeOperation, UmlModelServerAccess modelServerAccess) {
   }

}

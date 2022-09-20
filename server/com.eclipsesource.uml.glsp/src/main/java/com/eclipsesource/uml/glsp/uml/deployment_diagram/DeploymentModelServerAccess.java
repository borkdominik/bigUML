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
package com.eclipsesource.uml.glsp.uml.deployment_diagram;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.glsp.EMSModelServerAccess;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.glsp.server.types.ElementAndRoutingPoints;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.UmlModelServerClient;
import com.eclipsesource.uml.modelserver.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.condition.AddConditionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeRoutingPointsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact.AddArtifactCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact.RemoveArtifactCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact.SetArtifactNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath.AddCommunicationPathCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath.RemoveCommunicationPathCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath.SetCommunicationPathEndNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.component.AddDeploymentComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.component.SetDeploymentComponentNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentedge.AddDeploymentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentedge.RemoveDeploymentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification.AddDeploymentSpecificationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification.RemoveDeploymentSpecificationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification.SetDeploymentSpecificationNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device.AddDeviceCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device.RemoveDeviceCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device.SetDeviceNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.executionenvironment.AddExecutionEnvironmentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.executionenvironment.RemoveExecutionEnvironmentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.executionenvironment.SetExecutionEnvironmentNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node.AddNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node.RemoveNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node.SetNodeNameCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;

public class DeploymentModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(DeploymentModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public DeploymentModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
      super(sourceURI, modelServerClient, UMLResource.FILE_EXTENSION);
      Preconditions.checkNotNull(modelServerClient);
      this.notationFileExtension = UmlNotationUtil.NOTATION_EXTENSION;
      this.modelServerClient = modelServerClient;
   }

   @Override
   public EObject getSemanticModel() {
      try {
         return modelServerClient.get(getSemanticURI(), UMLResource.FILE_EXTENSION).thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

   public String getNotationUri() { return baseSourceUri.appendFileExtension(this.notationFileExtension).toString(); }

   public EObject getNotationModel() {
      try {
         return modelServerClient.get(getNotationUri(), FORMAT_XMI).thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

   protected String getSemanticUriFragment(final EObject element) {
      return EcoreUtil.getURI(element).fragment();
   }

   /*
    * Types
    */
   public CompletableFuture<Response<List<String>>> getUmlTypes() {
      return this.modelServerClient.getUmlTypes(getSemanticURI());
   }

   // FIXME
   public CompletableFuture<Response<List<String>>> getUmlBehaviors() {
      // return this.modelServerClient.getUmlBehaviors(getSemanticURI());
      return null;
   }
   // ======= COMMON ========

   /*
    * UML Constraint
    */
   public CompletableFuture<Response<Boolean>> addCondition(final UmlModelState modelState,
      final Optional<GPoint> newPosition,
      final Activity parent,
      final boolean isPrecondition) {
      CCompoundCommand addActivityCompoundCommand = AddConditionCommandContribution
         .create(getSemanticUriFragment(parent), isPrecondition);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setConditionBody(final UmlModelState modelState,
      final Constraint constraint, final String body) {

      // TODO: CHeck necessity
      /*
       * CCommand renameameCommand = SetBodyCommandContribution.create(getSemanticUriFragment(constraint),
       * body);
       * return this.edit(renameameCommand);
       */
      return null;
   }

   // Change Bounds
   public CompletableFuture<Response<Boolean>> changeBounds(final Map<Shape, ElementAndBounds> changeBoundsMap) {
      CCompoundCommand compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      compoundCommand.setType(ChangeBoundsCommandContribution.TYPE);
      changeBoundsMap.forEach((shape, elementAndBounds) -> {
         CCommand changeBoundsCommand = ChangeBoundsCommandContribution.create(shape.getSemanticElement().getUri(),
            elementAndBounds.getNewPosition(), elementAndBounds.getNewSize());
         compoundCommand.getCommands().add(changeBoundsCommand);
      });
      return this.edit(compoundCommand);
   }

   // Change Routing Points
   public CompletableFuture<Response<Boolean>> changeRoutingPoints(
      final Map<Edge, ElementAndRoutingPoints> changeBendPointsMap) {
      CCompoundCommand compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      compoundCommand.setType(ChangeRoutingPointsCommandContribution.TYPE);

      changeBendPointsMap.forEach((edge, elementAndRoutingPoints) -> {
         CCommand changeRoutingPointsCommand = ChangeRoutingPointsCommandContribution.create(
            edge.getSemanticElement().getUri(), elementAndRoutingPoints.getNewRoutingPoints());
         compoundCommand.getCommands().add(changeRoutingPointsCommand);
      });
      return this.edit(compoundCommand);
   }

   /*
    * Renaming
    */
   public CompletableFuture<Response<Boolean>> renameElement(final UmlModelState modelState,
      final NamedElement element, final String name) {

      CCommand renameameCommand = RenameElementCommandContribution.create(getSemanticUriFragment(element),
         name);
      return this.edit(renameameCommand);
   }

   // ================== CONTENT =================
   /*
    * DEPLOYMENT DIAGRAM
    */
   // DEPLOYMENT NODE
   public CompletableFuture<Response<Boolean>> addNode(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {

      CCompoundCommand addNodeCompoundCommand = AddNodeCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addNodeCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeNode(final UmlModelState modelState,
      final Node nodeToRemove) {

      NamedElement parentObject = (NamedElement) nodeToRemove.eContainer();

      String semanticProxyUri = getSemanticUriFragment(nodeToRemove);
      String parentProxyUri = getSemanticUriFragment(parentObject);

      CCompoundCommand compoundCommand = RemoveNodeCommandContribution.create(semanticProxyUri, parentProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setNodeName(final UmlModelState modelState,
      final Node nodeToRename, final String newName) {

      CCommand setNodeNameCommand = SetNodeNameCommandContribution.create(getSemanticUriFragment(nodeToRename),
         newName);
      return this.edit(setNodeNameCommand);
   }

   // ARTIFACT
   public CompletableFuture<Response<Boolean>> addArtifact(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {

      CCompoundCommand addArtifactCompoundCommand = AddArtifactCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addArtifactCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeArtifact(final UmlModelState modelState,
      final Artifact artifactToRemove) {

      EObject parent = artifactToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);

      String semanticProxyUri = getSemanticUriFragment(artifactToRemove);
      CCompoundCommand compoundCommand = RemoveArtifactCommandContribution.create(semanticProxyUri, parentUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setArtifactName(final UmlModelState modelState,
      final Artifact artifactToRename, final String newName) {

      CCommand setArtifactNameCommand = SetArtifactNameCommandContribution.create(
         getSemanticUriFragment(artifactToRename),
         newName);
      return this.edit(setArtifactNameCommand);
   }

   // DEVICE
   public CompletableFuture<Response<Boolean>> addDevice(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {

      CCompoundCommand addDeviceCompoundCommand = AddDeviceCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addDeviceCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeDevice(final UmlModelState modelState,
      final Device deviceToRemove) {
      EObject parent = deviceToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);

      String semanticProxyUri = getSemanticUriFragment(deviceToRemove);
      CCompoundCommand compoundCommand = RemoveDeviceCommandContribution.create(semanticProxyUri,
         parentUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setDeviceName(final UmlModelState modelState,
      final Device deviceToRename, final String newName) {

      CCommand setDeviceNameCommand = SetDeviceNameCommandContribution.create(
         getSemanticUriFragment(deviceToRename),
         newName);
      return this.edit(setDeviceNameCommand);
   }

   // EXECUTION ENVIRONMENT
   public CompletableFuture<Response<Boolean>> addExecutionEnvironment(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {

      CCompoundCommand addExecutionEnvironmentCompoundCommand = AddExecutionEnvironmentCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addExecutionEnvironmentCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeExecutionEnvironment(final UmlModelState modelState,
      final ExecutionEnvironment executionEnvironmentToRemove) {

      EObject parent = executionEnvironmentToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);

      String semanticProxyUri = getSemanticUriFragment(executionEnvironmentToRemove);
      CCompoundCommand compoundCommand = RemoveExecutionEnvironmentCommandContribution.create(semanticProxyUri,
         parentUri);

      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setExecutionEnvironmentName(final UmlModelState modelState,
      final ExecutionEnvironment executionEnvironmentToRename, final String newName) {

      CCommand setExecutionEnvironmentNameCommand = SetExecutionEnvironmentNameCommandContribution.create(
         getSemanticUriFragment(executionEnvironmentToRename),
         newName);
      return this.edit(setExecutionEnvironmentNameCommand);
   }

   // COMMUNICATION PATH
   public CompletableFuture<Response<Boolean>> addCommunicationPath(final UmlModelState modelState,
      final Classifier sourceNode, final Classifier targetNode) {

      CCompoundCommand addCommunicationPathCompoundCommand = AddCommunicationPathCommandContribution
         .create(getSemanticUriFragment(sourceNode), getSemanticUriFragment(targetNode));
      return this.edit(addCommunicationPathCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeCommunicationPath(final UmlModelState modelState,
      final CommunicationPath communicationPathToRemove) {

      String semanticProxyUri = getSemanticUriFragment(communicationPathToRemove);
      CCompoundCommand compoundCommand = RemoveCommunicationPathCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setCommunicationPathEndName(final UmlModelState modelState,
      final CommunicationPath communicationPathEnd, final String newName) {
      CCommand setCommunicationPathCommand = SetCommunicationPathEndNameCommandContribution.create(
         getSemanticUriFragment(communicationPathEnd), newName);
      return this.edit(setCommunicationPathCommand);
   }

   // DEPLOYMENT EDGE
   public CompletableFuture<Response<Boolean>> addDeployment(final UmlModelState modelState,
      final Artifact sourceArtifact, final Node targetNode) {

      CCompoundCommand addDeploymentCompoundCommand = AddDeploymentCommandContribution
         .create(getSemanticUriFragment(sourceArtifact), getSemanticUriFragment(targetNode));
      return this.edit(addDeploymentCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeDeployment(final UmlModelState modelState,
      final Deployment deploymentToRemove, final NamedElement sourceNode) {

      String semanticProxyUri = getSemanticUriFragment(deploymentToRemove);
      String semanticSourceProxyUri = getSemanticUriFragment(sourceNode);
      CCompoundCommand compoundCommand = RemoveDeploymentCommandContribution.create(semanticProxyUri,
         semanticSourceProxyUri);
      return this.edit(compoundCommand);
   }

   // DEPLOYMENT SPECIFICATION
   public CompletableFuture<Response<Boolean>> addDeploymentSpecification(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {

      CCompoundCommand addDeploymentSpecificationCompoundCommand = AddDeploymentSpecificationCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addDeploymentSpecificationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeDeploymentSpecification(final UmlModelState modelState,
      final DeploymentSpecification deploymentSpecificationToRemove) {
      EObject parent = deploymentSpecificationToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);

      String semanticProxyUri = getSemanticUriFragment(deploymentSpecificationToRemove);
      CCompoundCommand compoundCommand = RemoveDeploymentSpecificationCommandContribution.create(semanticProxyUri,
         parentUri);

      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setDeploymentSpecificationName(final UmlModelState modelState,
      final DeploymentSpecification deploymentSpecificationToRename, final String newName) {

      CCommand setDeploymentSpecificationNameCommand = SetDeploymentSpecificationNameCommandContribution.create(
         getSemanticUriFragment(deploymentSpecificationToRename),
         newName);
      return this.edit(setDeploymentSpecificationNameCommand);
   }

   // DEPLOYMENT COMPONENT
   public CompletableFuture<Response<Boolean>> addDeploymentComponent(final UmlModelState modelState,
      final GPoint position, final NamedElement parent) {

      CCommand addComponentCompoundCommand = AddDeploymentComponentCommandContribution
         .create(position, getSemanticUriFragment(parent));
      return this.edit(addComponentCompoundCommand);
   }

   /*
    * public CompletableFuture<Response<Boolean>> removeDeploymentComponent(final UmlModelState modelState,
    * final Component componentToRemove) {
    * String semanticProxyUri = getSemanticUriFragment(componentToRemove);
    * CCompoundCommand compoundCommand = RemoveComponentCommandContribution.create(semanticProxyUri);
    * return this.edit(compoundCommand);
    * }
    */

   public CompletableFuture<Response<Boolean>> setDeploymentComponentName(final UmlModelState modelState,
      final Component componentToRename,
      final String newName) {

      CCommand setDeploymentComponentNameCommand = SetDeploymentComponentNameCommandContribution.create(
         getSemanticUriFragment(componentToRename),
         newName);
      return this.edit(setDeploymentComponentNameCommand);
   }

}

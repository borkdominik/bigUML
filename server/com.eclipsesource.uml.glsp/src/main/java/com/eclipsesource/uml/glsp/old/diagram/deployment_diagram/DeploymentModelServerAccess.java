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
package com.eclipsesource.uml.glsp.old.diagram.deployment_diagram;

public class DeploymentModelServerAccess {
   /*-
   // ================== CONTENT =================
   /*
    * DEPLOYMENT DIAGRAM
    *
   // DEPLOYMENT NODE
   public CompletableFuture<Response<String>> addNode(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {
   
      CCompoundCommand addNodeCompoundCommand = AddNodeCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addNodeCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeNode(final UmlModelState modelState,
      final Node nodeToRemove) {
   
      NamedElement parentObject = (NamedElement) nodeToRemove.eContainer();
   
      String semanticProxyUri = getSemanticUriFragment(nodeToRemove);
      String parentProxyUri = getSemanticUriFragment(parentObject);
   
      CCompoundCommand compoundCommand = RemoveNodeCommandContribution.create(semanticProxyUri, parentProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setNodeName(final UmlModelState modelState,
      final Node nodeToRename, final String newName) {
   
      CCommand setNodeNameCommand = SetNodeNameCommandContribution.create(getSemanticUriFragment(nodeToRename),
         newName);
      return this.edit(setNodeNameCommand);
   }
   
   // ARTIFACT
   public CompletableFuture<Response<String>> addArtifact(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {
   
      CCompoundCommand addArtifactCompoundCommand = AddArtifactCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addArtifactCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeArtifact(final UmlModelState modelState,
      final Artifact artifactToRemove) {
   
      EObject parent = artifactToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);
   
      String semanticProxyUri = getSemanticUriFragment(artifactToRemove);
      CCompoundCommand compoundCommand = RemoveArtifactCommandContribution.create(semanticProxyUri, parentUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setArtifactName(final UmlModelState modelState,
      final Artifact artifactToRename, final String newName) {
   
      CCommand setArtifactNameCommand = SetArtifactNameCommandContribution.create(
         getSemanticUriFragment(artifactToRename),
         newName);
      return this.edit(setArtifactNameCommand);
   }
   
   // DEVICE
   public CompletableFuture<Response<String>> addDevice(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {
   
      CCompoundCommand addDeviceCompoundCommand = AddDeviceCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addDeviceCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeDevice(final UmlModelState modelState,
      final Device deviceToRemove) {
      EObject parent = deviceToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);
   
      String semanticProxyUri = getSemanticUriFragment(deviceToRemove);
      CCompoundCommand compoundCommand = RemoveDeviceCommandContribution.create(semanticProxyUri,
         parentUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setDeviceName(final UmlModelState modelState,
      final Device deviceToRename, final String newName) {
   
      CCommand setDeviceNameCommand = SetDeviceNameCommandContribution.create(
         getSemanticUriFragment(deviceToRename),
         newName);
      return this.edit(setDeviceNameCommand);
   }
   
   // EXECUTION ENVIRONMENT
   public CompletableFuture<Response<String>> addExecutionEnvironment(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {
   
      CCompoundCommand addExecutionEnvironmentCompoundCommand = AddExecutionEnvironmentCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addExecutionEnvironmentCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeExecutionEnvironment(final UmlModelState modelState,
      final ExecutionEnvironment executionEnvironmentToRemove) {
   
      EObject parent = executionEnvironmentToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);
   
      String semanticProxyUri = getSemanticUriFragment(executionEnvironmentToRemove);
      CCompoundCommand compoundCommand = RemoveExecutionEnvironmentCommandContribution.create(semanticProxyUri,
         parentUri);
   
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setExecutionEnvironmentName(final UmlModelState modelState,
      final ExecutionEnvironment executionEnvironmentToRename, final String newName) {
   
      CCommand setExecutionEnvironmentNameCommand = SetExecutionEnvironmentNameCommandContribution.create(
         getSemanticUriFragment(executionEnvironmentToRename),
         newName);
      return this.edit(setExecutionEnvironmentNameCommand);
   }
   
   // COMMUNICATION PATH
   public CompletableFuture<Response<String>> addCommunicationPath(final UmlModelState modelState,
      final Classifier sourceNode, final Classifier targetNode) {
   
      CCompoundCommand addCommunicationPathCompoundCommand = AddCommunicationPathCommandContribution
         .create(getSemanticUriFragment(sourceNode), getSemanticUriFragment(targetNode));
      return this.edit(addCommunicationPathCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeCommunicationPath(final UmlModelState modelState,
      final CommunicationPath communicationPathToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(communicationPathToRemove);
      CCompoundCommand compoundCommand = RemoveCommunicationPathCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setCommunicationPathEndName(final UmlModelState modelState,
      final CommunicationPath communicationPathEnd, final String newName) {
      CCommand setCommunicationPathCommand = SetCommunicationPathEndNameCommandContribution.create(
         getSemanticUriFragment(communicationPathEnd), newName);
      return this.edit(setCommunicationPathCommand);
   }
   
   // DEPLOYMENT EDGE
   public CompletableFuture<Response<String>> addDeployment(final UmlModelState modelState,
      final Artifact sourceArtifact, final Node targetNode) {
   
      CCompoundCommand addDeploymentCompoundCommand = AddDeploymentCommandContribution
         .create(getSemanticUriFragment(sourceArtifact), getSemanticUriFragment(targetNode));
      return this.edit(addDeploymentCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeDeployment(final UmlModelState modelState,
      final Deployment deploymentToRemove, final NamedElement sourceNode) {
   
      String semanticProxyUri = getSemanticUriFragment(deploymentToRemove);
      String semanticSourceProxyUri = getSemanticUriFragment(sourceNode);
      CCompoundCommand compoundCommand = RemoveDeploymentCommandContribution.create(semanticProxyUri,
         semanticSourceProxyUri);
      return this.edit(compoundCommand);
   }
   
   // DEPLOYMENT SPECIFICATION
   public CompletableFuture<Response<String>> addDeploymentSpecification(final UmlModelState modelState,
      final Optional<GPoint> newPosition, final NamedElement parent) {
   
      CCompoundCommand addDeploymentSpecificationCompoundCommand = AddDeploymentSpecificationCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent));
      return this.edit(addDeploymentSpecificationCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeDeploymentSpecification(final UmlModelState modelState,
      final DeploymentSpecification deploymentSpecificationToRemove) {
      EObject parent = deploymentSpecificationToRemove.eContainer();
      String parentUri = getSemanticUriFragment(parent);
   
      String semanticProxyUri = getSemanticUriFragment(deploymentSpecificationToRemove);
      CCompoundCommand compoundCommand = RemoveDeploymentSpecificationCommandContribution.create(semanticProxyUri,
         parentUri);
   
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setDeploymentSpecificationName(final UmlModelState modelState,
      final DeploymentSpecification deploymentSpecificationToRename, final String newName) {
   
      CCommand setDeploymentSpecificationNameCommand = SetDeploymentSpecificationNameCommandContribution.create(
         getSemanticUriFragment(deploymentSpecificationToRename),
         newName);
      return this.edit(setDeploymentSpecificationNameCommand);
   }
   
   // DEPLOYMENT COMPONENT
   public CompletableFuture<Response<String>> addDeploymentComponent(final UmlModelState modelState,
      final GPoint position, final NamedElement parent) {
   
      CCommand addComponentCompoundCommand = AddDeploymentComponentCommandContribution
         .create(position, getSemanticUriFragment(parent));
      return this.edit(addComponentCompoundCommand);
   }
   
   /*
    * public CompletableFuture<Response<String>> removeDeploymentComponent(final UmlModelState modelState,
    * final Component componentToRemove) {
    * String semanticProxyUri = getSemanticUriFragment(componentToRemove);
    * CCompoundCommand compoundCommand = RemoveComponentCommandContribution.create(semanticProxyUri);
    * return this.edit(compoundCommand);
    * }
    *
   
   public CompletableFuture<Response<String>> setDeploymentComponentName(final UmlModelState modelState,
      final Component componentToRename,
      final String newName) {
   
      CCommand setDeploymentComponentNameCommand = SetDeploymentComponentNameCommandContribution.create(
         getSemanticUriFragment(componentToRename),
         newName);
      return this.edit(setDeploymentComponentNameCommand);
   }
   */
}

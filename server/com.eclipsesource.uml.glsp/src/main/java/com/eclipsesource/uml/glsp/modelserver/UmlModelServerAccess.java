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
package com.eclipsesource.uml.glsp.modelserver;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.UmlModelServerClient;
import com.eclipsesource.uml.modelserver.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.action.AddActionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.action.SetBehaviorCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.activity.AddActivityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.activity.RemoveActivityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.*;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.condition.AddConditionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.controlnode.AddControlNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode.AddObjectNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode.AddParameterCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode.AddPinCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.exceptionhandler.AddExceptionHandlerCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.exceptionhandler.RemoveExceptionHandlerCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.AddControlFLowCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.RemoveActivityEdgeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.SetGuardCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.SetWeightCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.general.RemoveActivityNodeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.interruptibleregion.AddInterruptibleRegionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.partition.AddPartitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.partition.RemovePartitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.AddAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.RemoveAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.SetAssociationEndMultiplicityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.association.SetAssociationEndNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface.AddInterfaceCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.AddClassCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.RemoveClassCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.SetClassNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.AddEnumerationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.RemoveEnumerationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.SetEnumerationNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.generalization.AddClassGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.generalization.RemoveClassGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.*;
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
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.AddAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.SetAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.link.AddLinkCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.object.AddObjectCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.object.SetObjectNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate.AddFinalStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate.RemoveFinalStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.AddPseudoStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.RemovePseudoStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.SetPseudostateNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.state.AddStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.state.RemoveStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.state.SetStateNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior.AddBehaviorToStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior.RemoveBehaviorFromStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statebehavior.SetBehaviorInStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine.AddStateMachineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine.RemoveStateMachineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine.SetStateMachineNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.AddTransitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.RemoveTransitionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionEffectCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionGuardCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionLabelCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.specific.AddTransitionTriggerCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.actor.AddActorCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.actor.RemoveActorCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.actor.SetActorNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.association.AddUseCaseAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.association.RemoveUseCaseAssociationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.AddComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.RemoveComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge.AddExtendCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extendedge.RemoveExtendCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint.RemoveExtensionPointCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint.SetExtensionPointNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization.AddGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization.RemoveGeneralizationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge.AddIncludeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge.RemoveIncludeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase.AddUseCaseCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase.RemoveUseCaseCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase.SetUseCaseNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage.AddPackageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage.RemovePackageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage.SetPackageNameCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.base.Preconditions;
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
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.*;
import org.eclipse.uml2.uml.resource.UMLResource;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class UmlModelServerAccess extends EMSModelServerAccess {

   private static final Logger LOGGER = Logger.getLogger(UmlModelServerAccess.class);
   private final UmlModelServerClient modelServerClient;
   protected String notationFileExtension;

   public UmlModelServerAccess(final String sourceURI, final UmlModelServerClient modelServerClient) {
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

   public String getNotationUri() {
      return baseSourceUri.appendFileExtension(this.notationFileExtension).toString();
   }

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

   //FIXME
   public CompletableFuture<Response<List<String>>> getUmlBehaviors() {
      //return this.modelServerClient.getUmlBehaviors(getSemanticURI());
      return null;
   }

   /*
    * Class
    */
   public CompletableFuture<Response<Boolean>> addClass(final UmlModelState modelState,
                                                        final Optional<GPoint> newPosition,
                                                        final Boolean isAbstract) {

      CCompoundCommand addClassCompoundCommand = AddClassCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)), isAbstract);
      return this.edit(addClassCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeClass(final UmlModelState modelState,
                                                           final Class classToRemove) {

      String semanticProxyUri = getSemanticUriFragment(classToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setClassName(final UmlModelState modelState,
                                                            final Class classToRename, final String newName) {

      CCommand setClassNameCommand = SetClassNameCommandContribution.create(getSemanticUriFragment(classToRename),
            newName);
      return this.edit(setClassNameCommand);
   }

   /*
    * Interface
    */
   public CompletableFuture<Response<Boolean>> addInterface(final UmlModelState modelState,
                                                            final Optional<GPoint> newPosition) {

      CCompoundCommand adddInterfaceCompoundCommand = AddInterfaceCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(adddInterfaceCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeInterface(final UmlModelState modelState,
                                                               final Interface interfaceToRemove) {

      String semanticProxyUri = getSemanticUriFragment(interfaceToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setInterfaceName(final UmlModelState modelState,
                                                                final Interface interfaceToRename, final String newName) {

      CCommand setInterfaceNameCommand = SetClassNameCommandContribution.create(getSemanticUriFragment(interfaceToRename),
            newName);
      return this.edit(setInterfaceNameCommand);
   }

   /*
    * Enumeration
    */
   public CompletableFuture<Response<Boolean>> addEnumeration(final UmlModelState modelState,
                                                              final Optional<GPoint> newPosition) {

      CCompoundCommand addEnumerationCompoundCommand = AddEnumerationCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addEnumerationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeEnumeration(final UmlModelState modelState,
                                                                 final Enumeration enumerationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(enumerationToRemove);
      CCompoundCommand compoundCommand = RemoveEnumerationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setEnumerationName(final UmlModelState modelState,
                                                                  final Enumeration enumerationToRename, final String newName) {

      CCommand setEnumerationNameCommand = SetEnumerationNameCommandContribution.create(
            getSemanticUriFragment(enumerationToRename), newName);
      return this.edit(setEnumerationNameCommand);
   }

   /*
    * Property
    */
   public CompletableFuture<Response<Boolean>> addProperty(final UmlModelState modelState,
                                                           final Class parentClass) {

      CCommand addPropertyCommand = AddPropertyCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addPropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> removeProperty(final UmlModelState modelState,
                                                              final Property propertyToRemove) {

      Class parentClass = (Class) propertyToRemove.eContainer();
      CCommand removePropertyCommand = RemovePropertyCommandContribution
            .create(getSemanticUriFragment(parentClass), getSemanticUriFragment(propertyToRemove));
      return this.edit(removePropertyCommand);
   }

   /*public CompletableFuture<Response<Boolean>> setProperty(final UmlModelState modelState,
                                                           final Property propertyToRename, final String newName, final String newType, final String newBounds) {

      CCommand setPropertyNameCommand = SetPropertyBoundsCommandContribution
            .create(getSemanticUriFragment(propertyToRename), newName, newType, newBounds);
      return this.edit(setPropertyNameCommand);
   }*/

   public CompletableFuture<Response<Boolean>> setPropertyName(final UmlModelState modelState,
                                                               final Property propertyToRename, final String newName) {

      CCommand setPropertyNameCommand = SetPropertyNameCommandContribution
            .create(getSemanticUriFragment(propertyToRename), newName);
      return this.edit(setPropertyNameCommand);
   }

   public CompletableFuture<Response<Boolean>> setPropertyType(final UmlModelState modelState,
                                                               final Property propertyToRename, final String newType) {

      CCommand setPropertyNameCommand = SetPropertyTypeCommandContribution
            .create(getSemanticUriFragment(propertyToRename), newType);
      return this.edit(setPropertyNameCommand);
   }

   public CompletableFuture<Response<Boolean>> setPropertyBounds(final UmlModelState modelState,
                                                                 final Property propertyToRename, final String newBounds) {

      CCommand setPropertyNameCommand = SetPropertyBoundsCommandContribution
            .create(getSemanticUriFragment(propertyToRename), newBounds);
      return this.edit(setPropertyNameCommand);
   }

   /*
    * Association
    */
   public CompletableFuture<Response<Boolean>> addAssociation(final UmlModelState modelState,
                                                              final Class sourceClass, final Class targetClass,
                                                              final String keyword) {
      CCompoundCommand addAssociationCompoundCommand = AddAssociationCommandContribution
            .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass), keyword);
      return this.edit(addAssociationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeAssociation(final UmlModelState modelState,
                                                                 final Association associationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(associationToRemove);
      CCompoundCommand compoundCommand = RemoveAssociationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setAssociationEndName(final UmlModelState modelState,
                                                                     final Property associationEnd, final String newName) {

      CCommand setClassNameCommand = SetAssociationEndNameCommandContribution.create(
            getSemanticUriFragment(associationEnd), newName);
      return this.edit(setClassNameCommand);
   }

   public CompletableFuture<Response<Boolean>> setAssociationEndMultiplicity(final UmlModelState modelState,
                                                                             final Property associationEnd, final String newBounds) {

      CCommand setClassNameCommand = SetAssociationEndMultiplicityCommandContribution.create(
            getSemanticUriFragment(associationEnd), newBounds);
      return this.edit(setClassNameCommand);
   }

   /*
    * Class Generalization
    */
   public CompletableFuture<Response<Boolean>> addClassGeneralization(final UmlModelState modelState,
                                                                      final Classifier sourceClass, final Classifier targetClass) {
      System.out.println("REACHES MODELSERVER ACCESS");
      CCompoundCommand addClassGeneralizationCommand = AddClassGeneralizationCommandContribution
            .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass));
      System.out.println("SEMANTIC URI FRAGMENTS  source: " + getSemanticUriFragment(sourceClass) + " target: " + getSemanticUriFragment(targetClass));
      return this.edit(addClassGeneralizationCommand);
   }

   public CompletableFuture<Response<Boolean>> removeClassGeneralization(final UmlModelState modelState,
                                                                         final Generalization generalizationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(generalizationToRemove);
      CCompoundCommand compoundCommand = RemoveClassGeneralizationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   /*
    * OBJECT
    */
   public CompletableFuture<Response<Boolean>> addObject(final UmlModelState modelState,
                                                         final Optional<GPoint> newPosition) {
      CCompoundCommand addObjectCompoundCommand = AddObjectCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addObjectCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeObject(final UmlModelState modelState,
                                                            final NamedElement objectToRemove) {

      String semanticProxyUri = getSemanticUriFragment(objectToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setObjectName(final UmlModelState modelState,
                                                             final InstanceSpecification objectToRename, final String newName) {

      CCommand setObjectNameCommand = SetObjectNameCommandContribution.create(getSemanticUriFragment(objectToRename),
            newName);
      return this.edit(setObjectNameCommand);
   }

   /*
    * ATTRIBUTE
    */
   public CompletableFuture<Response<Boolean>> addAttribute(final UmlModelState modelState,
                                                            final Class parentClass) {

      CCommand addAttributeCommand = AddAttributeCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addAttributeCommand);
   }

   public CompletableFuture<Response<Boolean>> setAttribute(final UmlModelState modelState,
                                                            final Property attributeToRename, final String newName, final String newType, final String newBounds) {

      CCommand setPropertyNameCommand = SetAttributeCommandContribution
            .create(getSemanticUriFragment(attributeToRename), newName, newType, newBounds);
      return this.edit(setPropertyNameCommand);
   }

   /*
    * LINK
    */
   public CompletableFuture<Response<Boolean>> addLink(final UmlModelState modelState,
                                                       final Class sourceClass, final Class targetClass) {
      CCompoundCommand addLinkCompoundCommand = AddLinkCommandContribution
            .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass));
      return this.edit(addLinkCompoundCommand);
   }

   /*
    * ACTIVITY
    */
   public CompletableFuture<Response<Boolean>> addActivity(final UmlModelState modelState,
                                                           final Optional<GPoint> newPosition) {

      CCompoundCommand addActivityCompoundCommand = AddActivityCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivity(final UmlModelState modelState,
                                                              final Activity activity) {
      CCommand removePropertyCommand = RemoveActivityCommandContribution
            .create(getSemanticUriFragment(activity));
      return this.edit(removePropertyCommand);
   }

   /*
    * Partition
    */
   public CompletableFuture<Response<Boolean>> addPartition(final UmlModelState modelState,
                                                            final GPoint position, final EObject parent) {

      CCompoundCommand addPartitionCompoundCommand = AddPartitionCommandContribution
            .create(position, getSemanticUriFragment(parent));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivityGroup(final UmlModelState modelState,
                                                                   final ActivityGroup group) {
      CCommand removePropertyCommand = RemovePartitionCommandContribution
            .create(getSemanticUriFragment(group.getOwner()), getSemanticUriFragment(group));
      return this.edit(removePropertyCommand);
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

   public CompletableFuture<Response<Boolean>> setBehavior(final UmlModelState modelState,
                                                           final CallBehaviorAction cba, final String behavior) {

      CCommand renameameCommand = SetBehaviorCommandContribution.create(getSemanticUriFragment(cba),
            behavior);
      return this.edit(renameameCommand);
   }

   /*
    * UML Action
    */
   public CompletableFuture<Response<Boolean>> addAction(final UmlModelState modelState,
                                                         final Optional<GPoint> newPosition,
                                                         final EObject parent,
                                                         final java.lang.Class<? extends Action> clazz) {

      CCompoundCommand addActivityCompoundCommand = AddActionCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)), getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addEventAction(final UmlModelState modelState,
                                                              final GPoint newPosition, final EObject parent, final boolean isTimeEvent) {

      CCompoundCommand addActivityCompoundCommand = AddActionCommandContribution
            .create(newPosition, getSemanticUriFragment(parent), isTimeEvent);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivityNode(final UmlModelState modelState,
                                                                  final ActivityNode node) {
      Activity activity = node.getActivity();

      CCommand removePropertyCommand = RemoveActivityNodeCommandContribution
            .create(getSemanticUriFragment(activity), getSemanticUriFragment(node));
      return this.edit(removePropertyCommand);
   }

   /*
    * Control Nodes
    */
   public CompletableFuture<Response<Boolean>> addControlNode(final UmlModelState modelState,
                                                              final GPoint newPosition, final EObject parent, final java.lang.Class<? extends ControlNode> clazz) {

      CCompoundCommand addActivityCompoundCommand = AddControlNodeCommandContribution
            .create(newPosition, getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }

   /*
    * UML ControlFlow
    */
   public CompletableFuture<Response<Boolean>> addControlflow(final UmlModelState modelState,
                                                              final ActivityNode source, final ActivityNode target) {

      CCompoundCommand addControlflowCompoundCommand = AddControlFLowCommandContribution
            .create(getSemanticUriFragment(source), getSemanticUriFragment(target));
      return this.edit(addControlflowCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActivityEdge(final UmlModelState modelState,
                                                                  final ActivityEdge edge) {
      Activity activity = edge.getActivity();

      CCommand removePropertyCommand = RemoveActivityEdgeCommandContribution
            .create(getSemanticUriFragment(activity), getSemanticUriFragment(edge));
      return this.edit(removePropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> setGuard(final UmlModelState modelState,
                                                        final ControlFlow controlFlow, final String newValue) {

      CCommand setGuardCommand = SetGuardCommandContribution.create(getSemanticUriFragment(controlFlow), newValue);
      return this.edit(setGuardCommand);

   }

   public CompletableFuture<Response<Boolean>> setWeight(final UmlModelState modelState,
                                                         final ControlFlow controlFlow, final String newValue) {

      CCommand setGuardCommand = SetWeightCommandContribution.create(getSemanticUriFragment(controlFlow), newValue);
      return this.edit(setGuardCommand);

   }

   /*
    * UML ExceptionHandler
    */
   public CompletableFuture<Response<Boolean>> addExceptionHandler(final UmlModelState modelState,
                                                                   final ExecutableNode source, final Pin target) {

      CCompoundCommand addControlflowCompoundCommand = AddExceptionHandlerCommandContribution
            .create(getSemanticUriFragment(source), getSemanticUriFragment(target));
      return this.edit(addControlflowCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeExceptionHandler(final UmlModelState modelState,
                                                                      final ExceptionHandler handler) {
      CCommand removePropertyCommand = RemoveExceptionHandlerCommandContribution
            .create(getSemanticUriFragment(handler));
      return this.edit(removePropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> addInterruptibleRegion(final UmlModelState modelState,
                                                                      final GPoint position, final EObject parent) {

      CCompoundCommand addPartitionCompoundCommand = AddInterruptibleRegionCommandContribution
            .create(position, getSemanticUriFragment(parent));
      return this.edit(addPartitionCompoundCommand);
   }

   /*public CompletableFuture<Response<Boolean>> removeInterruptibleRegion(final UmlModelState modelState,
                                                                          final InterruptibleActivityRegion region) {
      CCommand removePropertyCommand = RemoveInterruptibleRegionCommandContribution
              .create(getSemanticUriFragment(region));
      return this.edit(removePropertyCommand);
   }*/


   /*
    * UML Data Flow
    */
   public CompletableFuture<Response<Boolean>> addParameter(final UmlModelState modelState, final Activity activity) {
      CCompoundCommand addPartitionCompoundCommand = AddParameterCommandContribution
            .create(getSemanticUriFragment(activity));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addPin(final UmlModelState modelState, final Action action) {
      CCompoundCommand addPartitionCompoundCommand = AddPinCommandContribution
            .create(getSemanticUriFragment(action));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addObjectNode(final UmlModelState modelState, final GPoint newPosition,
                                                             final Element parent, final java.lang.Class<? extends ObjectNode> clazz) {
      CCompoundCommand addActivityCompoundCommand = AddObjectNodeCommandContribution
            .create(newPosition, getSemanticUriFragment(parent), clazz);
      return this.edit(addActivityCompoundCommand);
   }

   /*
    * UML Constraint
    */
   public CompletableFuture<Response<Boolean>> addCondition(final UmlModelState modelState, final Activity parent,
                                                            final boolean isPrecondition) {
      CCompoundCommand addActivityCompoundCommand = AddConditionCommandContribution
            .create(getSemanticUriFragment(parent), isPrecondition);
      return this.edit(addActivityCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setConditionBody(final UmlModelState modelState,
                                                                final Constraint constraint, final String body) {

      CCommand renameameCommand = SetBodyCommandContribution.create(getSemanticUriFragment(constraint),
            body);
      return this.edit(renameameCommand);
   }

   /*
    * UML Comment
    */
   public CompletableFuture<Response<Boolean>> addComment(final UmlModelState modelState,
                                                          final GPoint position, final EObject object) {

      CCompoundCommand addPartitionCompoundCommand = AddCommentCommandContribution
            .create(position, getSemanticUriFragment(object));
      return this.edit(addPartitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setCommentBody(final UmlModelState modelState,
                                                              final Comment comment, final String name) {

      CCommand renameameCommand = SetBodyCommandContribution.create(getSemanticUriFragment(comment),
            name);
      return this.edit(renameameCommand);
   }

   public CompletableFuture<Response<Boolean>> removeComment(final UmlModelState modelState,
                                                             final Comment comment) {
      CCommand removePropertyCommand = RemoveCommentCommandContribution
            .create(getSemanticUriFragment(comment));
      return this.edit(removePropertyCommand);
   }

   public CompletableFuture<Response<Boolean>> linkComment(final UmlModelState modelState,
                                                           final Comment comment, final Element element) {

      CCommand renameameCommand = LinkCommentCommandContribution.create(getSemanticUriFragment(comment),
            getSemanticUriFragment(element));
      return this.edit(renameameCommand);
   }

   public CompletableFuture<Response<Boolean>> unlinkComment(final UmlModelState modelState,
                                                             final Comment comment, final Element element) {

      CCommand renameameCommand = UnlinkCommentCommandContribution.create(getSemanticUriFragment(comment),
            getSemanticUriFragment(element));
      return this.edit(renameameCommand);
   }

   /*
    * USECASE DIAGRAM
    */
   // USECASE
   public CompletableFuture<Response<Boolean>> addUseCase(final UmlModelState modelState,
                                                          final Optional<GPoint> newPosition) {
      CCompoundCommand addUseCaseCompoundCommand = AddUseCaseCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addUseCaseCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addUseCase(final UmlModelState modelState, final EObject parent,
                                                          final Optional<GPoint> newPosition) {
      /*if (!(parent instanceof Package || parent instanceof Component)) {
         throw new Exception("Element not valid as a parent for usecase");
      }*/
      CCommand addUseCaseCompoundCommand = AddUseCaseCommandContribution.create(newPosition.orElse(GraphUtil.point(0, 0)),
            getSemanticUriFragment(parent));
      return this.edit(addUseCaseCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeUseCase(final UmlModelState modelState,
                                                             final UseCase usecaseToRemove) {

      String semanticProxyUri = getSemanticUriFragment(usecaseToRemove);
      CCompoundCommand compoundCommand = RemoveUseCaseCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setUseCaseName(final UmlModelState modelState,
                                                              final UseCase useCaseToRename, final String newName) {

      CCommand setUsecaseNameCommand = SetUseCaseNameCommandContribution.create(getSemanticUriFragment(useCaseToRename),
            newName);
      return this.edit(setUsecaseNameCommand);
   }

   public CompletableFuture<Response<Boolean>> removeExtensionPoint(final UmlModelState modelState,
                                                                    final ExtensionPoint epToRemove) {

      String semanticProxyUri = getSemanticUriFragment(epToRemove);
      CCompoundCommand compoundCommand = RemoveExtensionPointCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setExtensionPointName(final UmlModelState modelState,
                                                                     final ExtensionPoint epToRename, final String newName) {

      CCommand setExtensionPointNameCommand = SetExtensionPointNameCommandContribution.create(
            getSemanticUriFragment(epToRename),
            newName);
      return this.edit(setExtensionPointNameCommand);
   }

   // PACKAGE
   public CompletableFuture<Response<Boolean>> addPackage(final UmlModelState modelState,
                                                          final Optional<GPoint> newPosition,
                                                          final NamedElement parentContainer) {
      CCompoundCommand addPackageCompoundCommand = AddPackageCommandContribution
            .create(getSemanticUriFragment(parentContainer), newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addPackageCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removePackage(final UmlModelState modelState,
                                                             final Package packageToRemove) {
      String semanticProxyUri = getSemanticUriFragment(packageToRemove);
      CCompoundCommand compoundCommand = RemovePackageCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setPackageName(final UmlModelState modelState,
                                                              final Package packageToRename, final String newName) {
      CCommand setPackageNameCommand = SetPackageNameCommandContribution
            .create(getSemanticUriFragment(packageToRename), newName);
      return this.edit(setPackageNameCommand);
   }

   // CONTAINER
   /*public CompletableFuture<Response<Boolean>> addComponent(final UmlModelState modelState,
                                                            final Optional<GPoint> newPosition) {

      CCompoundCommand addComponentCompoundCommand = AddComponentCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addComponentCompoundCommand);
   }*/

   public CompletableFuture<Response<Boolean>> addComponent(final UmlModelState modelState,
                                                            final Package parent,
                                                            final Optional<GPoint> newPosition) {

      CCompoundCommand addComponentCompoundCommand = AddComponentCommandContribution
            .create(getSemanticUriFragment(parent), newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addComponentCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeComponent(final UmlModelState modelState,
                                                               final Component componentToRemove) {
      String semanticProxyUri = getSemanticUriFragment(componentToRemove);
      CCompoundCommand compoundCommand = RemoveComponentCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // ACTOR
   public CompletableFuture<Response<Boolean>> addActor(final UmlModelState modelState,
                                                        final Optional<GPoint> newPosition) {
      CCompoundCommand addActorCompoundCommand = AddActorCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addActorCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addActor(final UmlModelState modelState,
                                                        final Package parent,
                                                        final Optional<GPoint> newPosition) {
      CCommand addActorCompoundCommand = AddActorCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)),
                  getSemanticUriFragment(parent));
      return this.edit(addActorCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeActor(final UmlModelState modelState,
                                                           final Actor actorToRemove) {

      String semanticProxyUri = getSemanticUriFragment(actorToRemove);
      CCompoundCommand compoundCommand = RemoveActorCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setActorName(final UmlModelState modelState,
                                                            final Actor actorToRename, final String newName) {

      CCommand setActorNameCommand = SetActorNameCommandContribution.create(getSemanticUriFragment(actorToRename),
            newName);
      return this.edit(setActorNameCommand);
   }

   // EXTEND
   public CompletableFuture<Response<Boolean>> addExtend(final UmlModelState modelState,
                                                         final UseCase extendingUseCase, final UseCase extendedUseCase) {

      CCompoundCommand addExtensionCompoundCommand = AddExtendCommandContribution
            .create(getSemanticUriFragment(extendingUseCase), getSemanticUriFragment(extendedUseCase));
      return this.edit(addExtensionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> addExtend(final UmlModelState modelState,
                                                         final UseCase extendingUseCase, final ExtensionPoint extendedUseCase) {

      CCompoundCommand addExtensionCompoundCommand = AddExtendCommandContribution
            .create(getSemanticUriFragment(extendingUseCase), getSemanticUriFragment(extendedUseCase));
      return this.edit(addExtensionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeExtend(final UmlModelState modelState,
                                                            final Extend extendToRemove) {

      String semanticProxyUri = getSemanticUriFragment(extendToRemove);
      CCompoundCommand compoundCommand = RemoveExtendCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // INCLUDE
   public CompletableFuture<Response<Boolean>> addInclude(final UmlModelState modelState,
                                                          final UseCase includingUseCase, final UseCase includedUseCase) {
      CCompoundCommand addIncludeCompoundCommand = AddIncludeCommandContribution
            .create(getSemanticUriFragment(includingUseCase), getSemanticUriFragment(includedUseCase));
      return this.edit(addIncludeCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeInclude(final UmlModelState modelState,
                                                             final Include includeToRemove) {

      String semanticProxyUri = getSemanticUriFragment(includeToRemove);
      CCompoundCommand compoundCommand = RemoveIncludeCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // GENERALIZATION
   public CompletableFuture<Response<Boolean>> addGeneralization(final UmlModelState modelState,
                                                                 final Classifier generalClassifier, final Classifier specificClassifier) {
      System.out.println("MODELSERVER ACCESS");
      CCompoundCommand addGeneralizationCompoundCommand = AddGeneralizationCommandContribution
            .create(getSemanticUriFragment(generalClassifier), getSemanticUriFragment(specificClassifier));
      return this.edit(addGeneralizationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeGeneralization(final UmlModelState modelState,
                                                                    final Generalization generalizationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(generalizationToRemove);
      CCompoundCommand compoundCommand = RemoveGeneralizationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   // USECASE ASSOCIATION
   public CompletableFuture<Response<Boolean>> addUseCaseAssociation(final UmlModelState modelState,
                                                                     final Classifier generalClassifier, final Classifier specificClassifier) {

      CCompoundCommand addGeneralizationCompoundCommand = AddUseCaseAssociationCommandContribution
            .create(getSemanticUriFragment(generalClassifier), getSemanticUriFragment(specificClassifier));
      return this.edit(addGeneralizationCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeUseCaseAssociation(final UmlModelState modelState,
                                                                        final Association associationToRemove) {

      String semanticProxyUri = getSemanticUriFragment(associationToRemove);
      CCompoundCommand compoundCommand = RemoveUseCaseAssociationCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

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

   /*public CompletableFuture<Response<Boolean>> removeDeploymentComponent(final UmlModelState modelState,
                                                               final Component componentToRemove) {

      String semanticProxyUri = getSemanticUriFragment(componentToRemove);
      CCompoundCommand compoundCommand = RemoveComponentCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }*/

   public CompletableFuture<Response<Boolean>> setDeploymentComponentName(final UmlModelState modelState,
                                                                          final Component componentToRename,
                                                                          final String newName) {

      CCommand setDeploymentComponentNameCommand = SetDeploymentComponentNameCommandContribution.create(
            getSemanticUriFragment(componentToRename),
            newName);
      return this.edit(setDeploymentComponentNameCommand);
   }

   /*
    * STATE MACHINE DIAGRAM
    */
   // STATE MACHINE
   public CompletableFuture<Response<Boolean>> addStateMachine(final UmlModelState modelState,
                                                               final Optional<GPoint> newPosition) {

      CCompoundCommand addStateMachineCompoundCommand = AddStateMachineCommandContribution
            .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addStateMachineCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeStateMachine(final UmlModelState modelState,
                                                                  final StateMachine stateMachineToRemove) {

      String semanticProxyUri = getSemanticUriFragment(stateMachineToRemove);
      CCompoundCommand compoundCommand = RemoveStateMachineCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setStateMachineName(final UmlModelState modelState,
                                                                   final Class classToRename, final String newName) {

      CCommand setStateMachineNameCommand = SetStateMachineNameCommandContribution.create(
            getSemanticUriFragment(classToRename),
            newName);
      return this.edit(setStateMachineNameCommand);
   }

   // STATE
   public CompletableFuture<Response<Boolean>> addState(final UmlModelState modelState,
                                                        final Region parentRegion, final GPoint newPosition) {

      CCommand addStateCompoundCommand = AddStateCommandContribution.create(getSemanticUriFragment(parentRegion),
            newPosition);
      return this.edit(addStateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeState(final UmlModelState modelState,
                                                           final State stateToRemove) {

      Region parentRegion = (Region) stateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemoveStateCommandContribution.create(getSemanticUriFragment(parentRegion),
            getSemanticUriFragment(stateToRemove));
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setStateName(final UmlModelState modelState,
                                                            final State stateToRename, final String newName) {
      CCommand setStateNameCommand = SetStateNameCommandContribution.create(getSemanticUriFragment(stateToRename),
            newName);
      return this.edit(setStateNameCommand);
   }

   // PSEUDOSTATE
   public CompletableFuture<Response<Boolean>> addPseudostate(final UmlModelState modelState,
                                                              final Region parentRegion, final PseudostateKind pseudostateKind, final GPoint newPosition) {

      CCommand addPseudostateCompoundCommand = AddPseudoStateCommandContribution
            .create(getSemanticUriFragment(parentRegion), pseudostateKind, newPosition);
      return this.edit(addPseudostateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removePseudostate(final UmlModelState modelState,
                                                                 final Pseudostate pseudostateToRemove) {

      NamedElement parentContainer = (NamedElement) pseudostateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemovePseudoStateCommandContribution.create(
            getSemanticUriFragment(parentContainer),
            getSemanticUriFragment(pseudostateToRemove));
      return this.edit(compoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setPseudostateName(final UmlModelState modelState,
                                                                  final Pseudostate pseudostateToRename, final String newName) {

      CCommand setPseudostateNameCommand = SetPseudostateNameCommandContribution
            .create(getSemanticUriFragment(pseudostateToRename), newName);

      return this.edit(setPseudostateNameCommand);
   }

   // FINAL STATE
   public CompletableFuture<Response<Boolean>> addFinalState(final UmlModelState modelState,
                                                             final Region parentRegion, final GPoint newPosition) {

      CCompoundCommand addFinalStateCompoundCommand = AddFinalStateCommandContribution
            .create(getSemanticUriFragment(parentRegion), newPosition);

      return this.edit(addFinalStateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeFinalState(final UmlModelState modelState,
                                                                final FinalState finalStateToRemove) {

      NamedElement containerRegion = (Region) finalStateToRemove.eContainer();
      CCompoundCommand compoundCommand = RemoveFinalStateCommandContribution.create(getSemanticUriFragment(containerRegion),
            getSemanticUriFragment(finalStateToRemove));

      return this.edit(compoundCommand);
   }

   // BEHAVIOUR IN STATE
   public CompletableFuture<Response<Boolean>> addBehaviorToState(final UmlModelState modelState,
                                                                  final State parentState, final String activityType) {

      CCommand addBehaviorToStateCompoundCommand = AddBehaviorToStateCommandContribution
            .create(getSemanticUriFragment(parentState), activityType);
      return this.edit(addBehaviorToStateCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> setBehaviorInState(final UmlModelState modelState,
                                                                  final Behavior behaviorToRename, final String behaviorType, final String newName) {

      CCommand setBehaviorInStateCommand = SetBehaviorInStateCommandContribution
            .create(getSemanticUriFragment(behaviorToRename), behaviorType, newName);
      return this.edit(setBehaviorInStateCommand);
   }

   public CompletableFuture<Response<Boolean>> removeBehaviorFromState(final UmlModelState modelState,
                                                                       final Behavior behaviorToRemove) {

      State parentState = (State) behaviorToRemove.eContainer();
      CCommand removeBehaviorFromStateCommand = RemoveBehaviorFromStateCommandContribution
            .create(getSemanticUriFragment(parentState), getSemanticUriFragment(behaviorToRemove));
      return this.edit(removeBehaviorFromStateCommand);
   }

   // TRANSITION
   public CompletableFuture<Response<Boolean>> addTransition(final UmlModelState modelState,
                                                             final Vertex source, final Vertex target) {

      Region parentRegion = (Region) source.eContainer();
      CCompoundCommand addTransitionCompoundCommand = AddTransitionCommandContribution
            .create(getSemanticUriFragment(parentRegion), getSemanticUriFragment(source), getSemanticUriFragment(target));

      return this.edit(addTransitionCompoundCommand);
   }

   public CompletableFuture<Response<Boolean>> removeTransition(final UmlModelState modelState,
                                                                final Transition transition) {

      Region parentRegion = (Region) transition.eContainer();
      CCommand removeTransitionCommand = RemoveTransitionCommandContribution
            .create(getSemanticUriFragment(parentRegion), getSemanticUriFragment(transition));

      return this.edit(removeTransitionCommand);
   }

   public CompletableFuture<Response<Boolean>> addTransitionLabel(final UmlModelState modelState,
                                                                  final Transition transition, final String newValue) {

      CCommand addTransitionLabelCommand = AddTransitionLabelCommandContribution.create(getSemanticUriFragment(transition),
            newValue);

      return this.edit(addTransitionLabelCommand);

   }

   public CompletableFuture<Response<Boolean>> addTransitionGuard(final UmlModelState modelState,
                                                                  final Transition transition, final String newValue) {

      CCommand addTransitionGuardCommand = AddTransitionGuardCommandContribution.create(getSemanticUriFragment(transition),
            newValue);

      return this.edit(addTransitionGuardCommand);

   }

   public CompletableFuture<Response<Boolean>> addTransitionEffect(final UmlModelState modelState,
                                                                   final Transition transition, final String newValue) {

      CCommand addTransitionEffectCommand = AddTransitionEffectCommandContribution.create(getSemanticUriFragment(transition),
            newValue);

      return this.edit(addTransitionEffectCommand);

   }

   public CompletableFuture<Response<Boolean>> addTransitionTrigger(final UmlModelState modelState,
                                                                    final Transition transition, final String newValue) {

      CCommand addTransitionTriggerCommand = AddTransitionTriggerCommandContribution.create(
            getSemanticUriFragment(transition),
            newValue);

      return this.edit(addTransitionTriggerCommand);

   }

   /*
    * COMMONS
    */
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

}

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
package com.eclipsesource.uml.modelserver;

import org.eclipse.emfcloud.modelserver.common.Routing;
import org.eclipse.emfcloud.modelserver.common.codecs.Codec;
import org.eclipse.emfcloud.modelserver.common.utils.MapBinding;
import org.eclipse.emfcloud.modelserver.common.utils.MultiBinding;
import org.eclipse.emfcloud.modelserver.edit.CommandContribution;
import org.eclipse.emfcloud.modelserver.emf.common.ModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.ResourceSetFactory;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.emf.di.DefaultModelServerModule;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.action.AddActionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.action.SetBehaviorCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.activity.AddActivityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.activity.RemoveActivityCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.AddCommentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.LinkCommentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.RemoveCommentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.SetBodyCommandContribution;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.UnlinkCommentCommandContribution;
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
import com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface.RemoveInterfaceCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface.SetInterfaceNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.AddClassCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.RemoveClassCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.SetClassNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.AddEnumerationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.RemoveEnumerationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration.SetEnumerationNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.AddPropertyCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.RemovePropertyCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyTypeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeRoutingPointsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.RenameElementCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.AddInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.CopyInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.RemoveInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.SetInteractionNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.AddLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.CopyLifelineWithMessagesCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.RemoveLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.SetLifelineNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.AddMessageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.RemoveMessageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.SetMessageNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact.AddArtifactCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact.RemoveArtifactCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.artifact.SetArtifactNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath.AddCommunicationPathCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath.RemoveCommunicationPathCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath.SetCommunicationPathEndNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.component.AddDeploymentComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.deploymentdiagram.component.RemoveDeploymentComponentCommandContribution;
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
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.RemoveAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute.SetAttributeCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.link.AddLinkCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.object.AddObjectCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.object.RemoveObjectCommandContribution;
import com.eclipsesource.uml.modelserver.commands.objectdiagram.object.SetObjectNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate.AddFinalStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate.RemoveFinalStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.AddPseudoStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.RemovePseudoStateCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate.SetPseudostateNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.statemachinediagram.region.AddRegionCommandContribution;
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
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.AddComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.RemoveComponentCommandContribution;
import com.eclipsesource.uml.modelserver.commands.usecasediagram.component.SetComponentNameCommandContribution;
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

public class UmlModelServerModule extends DefaultModelServerModule {

   @Override
   protected Class<? extends ModelResourceManager> bindModelResourceManager() {
      return UmlModelResourceManager.class;
   }

   @Override
   protected void configureEPackages(final MultiBinding<EPackageConfiguration> binding) {
      super.configureEPackages(binding);
      binding.add(UmlPackageConfiguration.class);
      binding.add(UnotationPackageConfiguration.class);
   }

   @Override
   protected void configureCommandCodecs(final MapBinding<String, CommandContribution> binding) {
      super.configureCommandCodecs(binding);
      // COMMONS
      // ChangeBounds
      binding.put(ChangeBoundsCommandContribution.TYPE, ChangeBoundsCommandContribution.class);
      // ChangeRoutingPoints
      binding.put(ChangeRoutingPointsCommandContribution.TYPE, ChangeRoutingPointsCommandContribution.class);
      // Comment
      binding.put(AddCommentCommandContribution.TYPE, AddCommentCommandContribution.class);
      binding.put(SetBodyCommandContribution.TYPE, SetBodyCommandContribution.class);
      binding.put(RemoveCommentCommandContribution.TYPE, RemoveCommentCommandContribution.class);
      binding.put(LinkCommentCommandContribution.TYPE, LinkCommentCommandContribution.class);
      binding.put(UnlinkCommentCommandContribution.TYPE, UnlinkCommentCommandContribution.class);

      // CLASS DIAGRAM
      // Class
      binding.put(AddClassCommandContribution.TYPE, AddClassCommandContribution.class);
      binding.put(RemoveClassCommandContribution.TYPE, RemoveClassCommandContribution.class);
      binding.put(SetClassNameCommandContribution.TYPE, SetClassNameCommandContribution.class);
      // Property
      binding.put(AddPropertyCommandContribution.TYPE, AddPropertyCommandContribution.class);
      binding.put(RemovePropertyCommandContribution.TYPE, RemovePropertyCommandContribution.class);
      // binding.put(SetPropertyCommandContribution.TYPE,
      // SetPropertyCommandContribution.class);
      binding.put(SetPropertyNameCommandContribution.TYPE, SetPropertyNameCommandContribution.class);
      binding.put(SetPropertyTypeCommandContribution.TYPE, SetPropertyTypeCommandContribution.class);
      binding.put(SetPropertyBoundsCommandContribution.TYPE, SetPropertyBoundsCommandContribution.class);
      // Association
      binding.put(AddAssociationCommandContribution.TYPE, AddAssociationCommandContribution.class);
      binding.put(RemoveAssociationCommandContribution.TYPE, RemoveAssociationCommandContribution.class);
      binding.put(SetAssociationEndNameCommandContribution.TYPE, SetAssociationEndNameCommandContribution.class);
      binding.put(SetAssociationEndMultiplicityCommandContribution.TYPE,
         SetAssociationEndMultiplicityCommandContribution.class);
      // Generalisation
      /*
       * binding.put(AddClassGeneralizationCommandContribution.TYPE,
       * AddClassGeneralizationCommandContribution.class);
       * binding.put(RemoveClassGeneralizationCommandContribution.TYPE,
       * RemoveClassGeneralizationCommandContribution.class);
       */
      // Interface
      binding.put(AddInterfaceCommandContribution.TYPE, AddInterfaceCommandContribution.class);
      binding.put(RemoveInterfaceCommandContribution.TYPE, RemoveInterfaceCommandContribution.class);
      binding.put(SetInterfaceNameCommandContribution.TYPE, SetInterfaceNameCommandContribution.class);
      // Enumeration
      binding.put(AddEnumerationCommandContribution.TYPE, AddEnumerationCommandContribution.class);
      binding.put(RemoveEnumerationCommandContribution.TYPE, RemoveEnumerationCommandContribution.class);
      binding.put(SetEnumerationNameCommandContribution.TYPE, SetEnumerationNameCommandContribution.class);

      // ACTIVITY DIAGRAM
      binding.put(RenameElementCommandContribution.TYPE, RenameElementCommandContribution.class);
      // Activity
      binding.put(AddActivityCommandContribution.TYPE, AddActivityCommandContribution.class);
      binding.put(RemoveActivityCommandContribution.TYPE, RemoveActivityCommandContribution.class);
      // Partition
      binding.put(AddPartitionCommandContribution.TYPE, AddPartitionCommandContribution.class);
      binding.put(RemovePartitionCommandContribution.TYPE, RemovePartitionCommandContribution.class);
      // Action
      binding.put(AddActionCommandContribution.TYPE, AddActionCommandContribution.class);
      binding.put(RemoveActivityNodeCommandContribution.TYPE, RemoveActivityNodeCommandContribution.class);
      binding.put(SetBehaviorCommandContribution.TYPE, SetBehaviorCommandContribution.class);
      // ControlFlow
      binding.put(AddControlFLowCommandContribution.TYPE, AddControlFLowCommandContribution.class);
      binding.put(RemoveActivityEdgeCommandContribution.TYPE, RemoveActivityEdgeCommandContribution.class);
      binding.put(SetGuardCommandContribution.TYPE, SetGuardCommandContribution.class);
      binding.put(SetWeightCommandContribution.TYPE, SetWeightCommandContribution.class);
      // ControlNode
      binding.put(AddControlNodeCommandContribution.TYPE, AddControlNodeCommandContribution.class);
      // Dataflow
      binding.put(AddParameterCommandContribution.TYPE, AddParameterCommandContribution.class);
      binding.put(AddPinCommandContribution.TYPE, AddPinCommandContribution.class);
      binding.put(AddObjectNodeCommandContribution.TYPE, AddObjectNodeCommandContribution.class);
      // Exceptions
      binding.put(AddExceptionHandlerCommandContribution.TYPE, AddExceptionHandlerCommandContribution.class);
      binding.put(RemoveExceptionHandlerCommandContribution.TYPE, RemoveExceptionHandlerCommandContribution.class);
      binding.put(AddInterruptibleRegionCommandContribution.TYPE, AddInterruptibleRegionCommandContribution.class);

      binding.put(AddConditionCommandContribution.TYPE, AddConditionCommandContribution.class);

      // USECASE DIAGRAM
      // Actor
      binding.put(AddActorCommandContribution.TYPE, AddActorCommandContribution.class);
      binding.put(RemoveActorCommandContribution.TYPE, RemoveActorCommandContribution.class);
      binding.put(SetActorNameCommandContribution.TYPE, SetActorNameCommandContribution.class);
      // UseCase
      binding.put(AddUseCaseCommandContribution.TYPE, AddUseCaseCommandContribution.class);
      binding.put(RemoveUseCaseCommandContribution.TYPE, RemoveUseCaseCommandContribution.class);
      binding.put(SetUseCaseNameCommandContribution.TYPE, SetUseCaseNameCommandContribution.class);
      binding.put(SetExtensionPointNameCommandContribution.TYPE, SetExtensionPointNameCommandContribution.class);
      binding.put(RemoveExtensionPointCommandContribution.TYPE, RemoveExtensionPointCommandContribution.class);
      // Package
      binding.put(AddPackageCommandContribution.TYPE, AddPackageCommandContribution.class);
      binding.put(RemovePackageCommandContribution.TYPE, RemovePackageCommandContribution.class);
      binding.put(SetPackageNameCommandContribution.TYPE, SetPackageNameCommandContribution.class);
      // Component
      binding.put(AddComponentCommandContribution.TYPE, AddComponentCommandContribution.class);
      binding.put(RemoveComponentCommandContribution.TYPE, RemoveComponentCommandContribution.class);
      binding.put(SetComponentNameCommandContribution.TYPE, SetComponentNameCommandContribution.class);
      // Extend
      binding.put(AddExtendCommandContribution.TYPE, AddExtendCommandContribution.class);
      binding.put(RemoveExtendCommandContribution.TYPE, RemoveExtendCommandContribution.class);
      // Include
      binding.put(AddIncludeCommandContribution.TYPE, AddIncludeCommandContribution.class);
      binding.put(RemoveIncludeCommandContribution.TYPE, RemoveIncludeCommandContribution.class);
      // Generalization
      binding.put(AddGeneralizationCommandContribution.TYPE, AddGeneralizationCommandContribution.class);
      binding.put(RemoveGeneralizationCommandContribution.TYPE, RemoveGeneralizationCommandContribution.class);
      // Association
      /*
       * binding.put(AddUseCaseAssociationCommandContribution.TYPE,
       * AddUseCaseAssociationCommandContribution.class);
       * binding.put(RemoveUseCaseAssociationCommandContribution.TYPE,
       * RemoveUseCaseAssociationCommandContribution.class);
       */

      // STATEMACHINE DIAGRAM
      // StateMachine
      binding.put(AddStateMachineCommandContribution.TYPE, AddStateMachineCommandContribution.class);
      binding.put(RemoveStateMachineCommandContribution.TYPE, RemoveStateMachineCommandContribution.class);
      binding.put(SetStateMachineNameCommandContribution.TYPE, SetStateMachineNameCommandContribution.class);
      // Region
      binding.put(AddRegionCommandContribution.TYPE, AddRegionCommandContribution.class);
      // State
      binding.put(AddStateCommandContribution.TYPE, AddStateCommandContribution.class);
      binding.put(RemoveStateCommandContribution.TYPE, RemoveStateCommandContribution.class);
      binding.put(SetStateNameCommandContribution.TYPE, SetStateNameCommandContribution.class);
      // Final State
      binding.put(AddFinalStateCommandContribution.TYPE, AddFinalStateCommandContribution.class);
      binding.put(RemoveFinalStateCommandContribution.TYPE, RemoveFinalStateCommandContribution.class);
      // Transition
      binding.put(AddTransitionCommandContribution.TYPE, AddTransitionCommandContribution.class);
      binding.put(RemoveTransitionCommandContribution.TYPE, RemoveTransitionCommandContribution.class);
      binding.put(AddTransitionEffectCommandContribution.TYPE, AddTransitionEffectCommandContribution.class);
      binding.put(AddTransitionGuardCommandContribution.TYPE, AddTransitionGuardCommandContribution.class);
      binding.put(AddTransitionLabelCommandContribution.TYPE, AddTransitionLabelCommandContribution.class);
      binding.put(AddTransitionTriggerCommandContribution.TYPE, AddTransitionTriggerCommandContribution.class);
      // Pseudo State
      binding.put(AddPseudoStateCommandContribution.TYPE, AddPseudoStateCommandContribution.class);
      binding.put(RemovePseudoStateCommandContribution.TYPE, RemovePseudoStateCommandContribution.class);
      binding.put(SetPseudostateNameCommandContribution.TYPE, SetPseudostateNameCommandContribution.class);
      // Behavior
      binding.put(AddBehaviorToStateCommandContribution.TYPE, AddBehaviorToStateCommandContribution.class);
      binding.put(SetBehaviorInStateCommandContribution.TYPE, SetBehaviorInStateCommandContribution.class);
      binding.put(RemoveBehaviorFromStateCommandContribution.TYPE, RemoveBehaviorFromStateCommandContribution.class);

      // DEPLOYMENT DIAGRAM
      // Node
      binding.put(AddNodeCommandContribution.TYPE, AddNodeCommandContribution.class);
      binding.put(RemoveNodeCommandContribution.TYPE, RemoveNodeCommandContribution.class);
      binding.put(SetNodeNameCommandContribution.TYPE, SetNodeNameCommandContribution.class);
      // Artifact
      binding.put(AddArtifactCommandContribution.TYPE, AddArtifactCommandContribution.class);
      binding.put(RemoveArtifactCommandContribution.TYPE, RemoveArtifactCommandContribution.class);
      binding.put(SetArtifactNameCommandContribution.TYPE, SetArtifactNameCommandContribution.class);
      // CommunicationPath
      binding.put(AddCommunicationPathCommandContribution.TYPE, AddCommunicationPathCommandContribution.class);
      binding.put(RemoveCommunicationPathCommandContribution.TYPE, RemoveCommunicationPathCommandContribution.class);
      binding.put(SetCommunicationPathEndNameCommandContribution.TYPE,
         SetCommunicationPathEndNameCommandContribution.class);
      // Device
      binding.put(AddDeviceCommandContribution.TYPE, AddDeviceCommandContribution.class);
      binding.put(RemoveDeviceCommandContribution.TYPE, RemoveDeviceCommandContribution.class);
      binding.put(SetDeviceNameCommandContribution.TYPE, SetDeviceNameCommandContribution.class);
      // Deployment edge
      binding.put(AddDeploymentCommandContribution.TYPE, AddDeploymentCommandContribution.class);
      binding.put(RemoveDeploymentCommandContribution.TYPE, RemoveDeploymentCommandContribution.class);
      // DeploymentSpecification
      binding.put(AddDeploymentSpecificationCommandContribution.TYPE,
         AddDeploymentSpecificationCommandContribution.class);
      binding.put(RemoveDeploymentSpecificationCommandContribution.TYPE,
         RemoveDeploymentSpecificationCommandContribution.class);
      binding.put(SetDeploymentSpecificationNameCommandContribution.TYPE,
         SetDeploymentSpecificationNameCommandContribution.class);
      // ExecutionEnvironment
      binding.put(AddExecutionEnvironmentCommandContribution.TYPE, AddExecutionEnvironmentCommandContribution.class);
      binding.put(RemoveExecutionEnvironmentCommandContribution.TYPE,
         RemoveExecutionEnvironmentCommandContribution.class);
      binding.put(SetExecutionEnvironmentNameCommandContribution.TYPE,
         SetExecutionEnvironmentNameCommandContribution.class);
      // Component
      binding.put(AddDeploymentComponentCommandContribution.TYPE, AddDeploymentComponentCommandContribution.class);
      binding.put(RemoveDeploymentComponentCommandContribution.TYPE,
         RemoveDeploymentComponentCommandContribution.class);
      binding.put(SetDeploymentComponentNameCommandContribution.TYPE,
         SetDeploymentComponentNameCommandContribution.class);

      // OBJECT DIAGRAM
      // Object
      binding.put(AddObjectCommandContribution.TYPE, AddObjectCommandContribution.class);
      binding.put(RemoveObjectCommandContribution.TYPE, RemoveObjectCommandContribution.class);
      binding.put(SetObjectNameCommandContribution.TYPE, SetObjectNameCommandContribution.class);
      // Link
      binding.put(AddLinkCommandContribution.TYPE, AddLinkCommandContribution.class);
      // Attribute
      binding.put(AddAttributeCommandContribution.TYPE, AddAttributeCommandContribution.class);
      binding.put(RemoveAttributeCommandContribution.TYPE, RemoveAttributeCommandContribution.class);
      binding.put(SetAttributeCommandContribution.TYPE, SetAttributeCommandContribution.class);

      // UML Communication
      binding.put(AddInteractionCommandContribution.TYPE, AddInteractionCommandContribution.class);
      binding.put(SetInteractionNameCommandContribution.TYPE, SetInteractionNameCommandContribution.class);
      binding.put(RemoveInteractionCommandContribution.TYPE, RemoveInteractionCommandContribution.class);
      binding.put(AddLifelineCommandContribution.TYPE, AddLifelineCommandContribution.class);
      binding.put(RemoveLifelineCommandContribution.TYPE, RemoveLifelineCommandContribution.class);
      binding.put(SetLifelineNameCommandContribution.TYPE, SetLifelineNameCommandContribution.class);
      binding.put(AddMessageCommandContribution.TYPE, AddMessageCommandContribution.class);
      binding.put(RemoveMessageCommandContribution.TYPE, RemoveMessageCommandContribution.class);
      binding.put(SetMessageNameCommandContribution.TYPE, SetMessageNameCommandContribution.class);
      binding.put(CopyInteractionCommandContribution.TYPE, CopyInteractionCommandContribution.class);
      binding.put(CopyLifelineWithMessagesCommandContribution.TYPE, CopyLifelineWithMessagesCommandContribution.class);

   }

   @Override
   protected void configureCodecs(final MapBinding<String, Codec> binding) {
      super.configureCodecs(binding);
      binding.put(UMLResource.FILE_EXTENSION, UmlCodec.class);
   }

   @Override
   protected void configureRoutings(final MultiBinding<Routing> binding) {
      super.configureRoutings(binding);
      binding.add(UmlModelServerRouting.class);
   }

   @Override
   protected Class<? extends ResourceSetFactory> bindResourceSetFactory() {
      return UmlResourceSetFactory.class;
   }

}

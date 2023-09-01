/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.manifest;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ClientActionContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Artifact;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Comment;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_CommunicationPath;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Constraint;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Dependency;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Deployment;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_DeploymentSpecification;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Device;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_ExecutionEnvironment;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Generalization;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Manifestation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Model;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Node;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Package;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Parameter;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Property;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.ArtifactLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.CommunicationPathLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.DependencyLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.DeploymentLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.DeploymentSpecificationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.DeviceLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.ExecutionEnvironmentLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.ManifestationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.ModelLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.NodeLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.OperationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.PackageLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.label_edit.PropertyLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.ArtifactPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.CommunicationPathPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.DependencyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.DeploymentPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.DeploymentSpecificationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.DevicePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.ExecutionEnvironmentPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.GeneralizationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.ManifestationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.ModelPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.NodePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.OperationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.PackagePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.ParameterPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete.PropertyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.tool_palette.DeploymentToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.ArtifactNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.CommentCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.CommunicationPathEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.ConstraintCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.DependencyEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.DeploymentEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.DeploymentSpecificationNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.DeviceNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.ExecutionEnvironmentNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.GeneralizationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.ManifestationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.ModelNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.NodeNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.OperationCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.PackageNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel.PropertyCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.artifact.CreateArtifactHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.artifact.DeleteArtifactHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.artifact.UpdateArtifactHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.communication_path.CreateCommunicationPathHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.communication_path.DeleteCommunicationPathHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.communication_path.UpdateCommunicationPathHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.dependency.CreateDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.dependency.DeleteDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.dependency.UpdateDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment.CreateDeploymentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment.DeleteDeploymentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment.UpdateDeploymentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment_specification.CreateDeploymentSpecificationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment_specification.DeleteDeploymentSpecificationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.deployment_specification.UpdateDeploymentSpecificationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.device.CreateDeviceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.device.DeleteDeviceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.device.UpdateDeviceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.execution_environment.CreateExecutionEnvironmentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.execution_environment.DeleteExecutionEnvironmentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.execution_environment.UpdateExecutionEnvironmentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.generalization.CreateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.generalization.DeleteGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.generalization.UpdateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.manifestation.CreateManifestationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.manifestation.DeleteManifestationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.manifestation.UpdateManifestationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.model.CreateModelHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.model.DeleteModelHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.model.UpdateModelHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.node.CreateNodeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.node.DeleteNodeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.node.UpdateNodeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.operation.CreateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.operation.DeleteOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.operation.UpdateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.parameter.CreateParameterHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.parameter.DeleteParameterHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.parameter.UpdateParameterHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.property.CreatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.property.DeletePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.property.UpdatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.upackage.CreatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.upackage.DeletePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.upackage.UpdatePackageHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class DeploymentUmlManifest extends DiagramManifest implements DiagramCreateHandlerContribution,
   DiagramDeleteHandlerContribution, DiagramLabelEditMapperContribution, SuffixIdAppenderContribution,
   DiagramElementPropertyMapperContribution, DiagramUpdateHandlerContribution,
   ClientActionContribution, ActionHandlerContribution {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.DEPLOYMENT;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration((nodes) -> {
         nodes.addBinding().to(UmlDeployment_DeploymentSpecification.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Artifact.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Device.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_ExecutionEnvironment.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Model.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Node.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Package.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Operation.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Property.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Comment.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Constraint.DiagramConfiguration.class);
         nodes.addBinding().to(UmlDeployment_Parameter.DiagramConfiguration.class);
      }, (edges) -> {
         edges.addBinding().to(UmlDeployment_CommunicationPath.DiagramConfiguration.class);
         edges.addBinding().to(UmlDeployment_Dependency.DiagramConfiguration.class);
         edges.addBinding().to(UmlDeployment_Manifestation.DiagramConfiguration.class);
         edges.addBinding().to(UmlDeployment_Deployment.DiagramConfiguration.class);
         edges.addBinding().to(UmlDeployment_Generalization.DiagramConfiguration.class);
      });

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(DeploymentToolPaletteConfiguration.class);
      });

      contributeDiagramCreateNodeHandlers((contribution) -> {
         contribution.addBinding().to(CreateDeploymentSpecificationHandler.class);
         contribution.addBinding().to(CreateArtifactHandler.class);
         contribution.addBinding().to(CreateDeviceHandler.class);
         contribution.addBinding().to(CreateExecutionEnvironmentHandler.class);
         contribution.addBinding().to(CreateModelHandler.class);
         contribution.addBinding().to(CreateNodeHandler.class);
         contribution.addBinding().to(CreatePackageHandler.class);
         contribution.addBinding().to(CreateOperationHandler.class);
         contribution.addBinding().to(CreatePropertyHandler.class);
         contribution.addBinding().to(CreateParameterHandler.class);
      });

      contributeDiagramCreateEdgeHandlers((contribution) -> {
         contribution.addBinding().to(CreateCommunicationPathHandler.class);
         contribution.addBinding().to(CreateDependencyHandler.class);
         contribution.addBinding().to(CreateManifestationHandler.class);
         contribution.addBinding().to(CreateDeploymentHandler.class);
         contribution.addBinding().to(CreateGeneralizationHandler.class);
      });

      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteDeploymentSpecificationHandler.class);
         contribution.addBinding().to(DeleteCommunicationPathHandler.class);
         contribution.addBinding().to(DeleteDependencyHandler.class);
         contribution.addBinding().to(DeleteManifestationHandler.class);
         contribution.addBinding().to(DeleteDeploymentHandler.class);
         contribution.addBinding().to(DeleteGeneralizationHandler.class);
         contribution.addBinding().to(DeleteArtifactHandler.class);
         contribution.addBinding().to(DeleteDeviceHandler.class);
         contribution.addBinding().to(DeleteExecutionEnvironmentHandler.class);
         contribution.addBinding().to(DeleteModelHandler.class);
         contribution.addBinding().to(DeleteNodeHandler.class);
         contribution.addBinding().to(DeletePackageHandler.class);
         contribution.addBinding().to(DeleteOperationHandler.class);
         contribution.addBinding().to(DeletePropertyHandler.class);
         contribution.addBinding().to(DeleteParameterHandler.class);

      });

      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateDeploymentSpecificationHandler.class);
         contribution.addBinding().to(UpdateArtifactHandler.class);
         contribution.addBinding().to(UpdateDeviceHandler.class);
         contribution.addBinding().to(UpdateCommunicationPathHandler.class);
         contribution.addBinding().to(UpdateDependencyHandler.class);
         contribution.addBinding().to(UpdateManifestationHandler.class);
         contribution.addBinding().to(UpdateDeploymentHandler.class);
         contribution.addBinding().to(UpdateGeneralizationHandler.class);
         contribution.addBinding().to(UpdateExecutionEnvironmentHandler.class);
         contribution.addBinding().to(UpdateModelHandler.class);
         contribution.addBinding().to(UpdateNodeHandler.class);
         contribution.addBinding().to(UpdatePackageHandler.class);
         contribution.addBinding().to(UpdateOperationHandler.class);
         contribution.addBinding().to(UpdatePropertyHandler.class);
         contribution.addBinding().to(UpdateParameterHandler.class);

      });

      contributeGModelMappers((contribution) -> {
         contribution.addBinding().to(DeploymentSpecificationNodeMapper.class);
         contribution.addBinding().to(CommunicationPathEdgeMapper.class);
         contribution.addBinding().to(DependencyEdgeMapper.class);
         contribution.addBinding().to(ManifestationEdgeMapper.class);
         contribution.addBinding().to(DeploymentEdgeMapper.class);
         contribution.addBinding().to(GeneralizationEdgeMapper.class);
         contribution.addBinding().to(ArtifactNodeMapper.class);
         contribution.addBinding().to(DeviceNodeMapper.class);
         contribution.addBinding().to(ExecutionEnvironmentNodeMapper.class);
         contribution.addBinding().to(ModelNodeMapper.class);
         contribution.addBinding().to(NodeNodeMapper.class);
         contribution.addBinding().to(PackageNodeMapper.class);
         contribution.addBinding().to(OperationCompartmentMapper.class);
         contribution.addBinding().to(CommentCompartmentMapper.class);
         contribution.addBinding().to(ConstraintCompartmentMapper.class);
         contribution.addBinding().to(PropertyCompartmentMapper.class);
      });

      contributeDiagramLabelEditMappers((contribution) -> {
         contribution.addBinding().to(DeploymentSpecificationLabelEditMapper.class);
         contribution.addBinding().to(CommunicationPathLabelEditMapper.class);
         contribution.addBinding().to(DependencyLabelEditMapper.class);
         contribution.addBinding().to(ManifestationLabelEditMapper.class);
         contribution.addBinding().to(DeploymentLabelEditMapper.class);
         contribution.addBinding().to(ArtifactLabelEditMapper.class);
         contribution.addBinding().to(DeviceLabelEditMapper.class);
         contribution.addBinding().to(ExecutionEnvironmentLabelEditMapper.class);
         contribution.addBinding().to(ModelLabelEditMapper.class);
         contribution.addBinding().to(NodeLabelEditMapper.class);
         contribution.addBinding().to(PackageLabelEditMapper.class);
         contribution.addBinding().to(OperationLabelEditMapper.class);
         contribution.addBinding().to(PropertyLabelEditMapper.class);
      });

      contributeDiagramElementPropertyMappers((contribution) -> {
         contribution.addBinding().to(DeploymentSpecificationPropertyMapper.class);
         contribution.addBinding().to(CommunicationPathPropertyMapper.class);
         contribution.addBinding().to(DependencyPropertyMapper.class);
         contribution.addBinding().to(ManifestationPropertyMapper.class);
         contribution.addBinding().to(DeploymentPropertyMapper.class);
         contribution.addBinding().to(GeneralizationPropertyMapper.class);
         contribution.addBinding().to(ArtifactPropertyMapper.class);
         contribution.addBinding().to(DevicePropertyMapper.class);
         contribution.addBinding().to(ExecutionEnvironmentPropertyMapper.class);
         contribution.addBinding().to(ModelPropertyMapper.class);
         contribution.addBinding().to(NodePropertyMapper.class);
         contribution.addBinding().to(PackagePropertyMapper.class);
         contribution.addBinding().to(OperationPropertyMapper.class);
         contribution.addBinding().to(PropertyPropertyMapper.class);
         contribution.addBinding().to(ParameterPropertyMapper.class);

      });

   }
}

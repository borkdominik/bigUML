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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.manifest;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditValidatorContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramReconnectEdgeHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.PopupMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ClientActionContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Abstraction;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Class;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_DataType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Dependency;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Enumeration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_EnumerationLiteral;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Generalization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Interface;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_InterfaceRealization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Package;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PackageImport;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PackageMerge;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Parameter;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PrimitiveType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Realization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Substitution;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Usage;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.AssociationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.ClassLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.DataTypeLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.EnumerationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.EnumerationLiteralLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.InterfaceLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.OperationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.PackageLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.PrimitiveTypeLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.PropertyLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.validation.BlankLabelEditValidator;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.validation.PropertyLabelEditValidator;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.popup.ClassPopupMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.AbstractionPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.AssociationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.ClassPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.DataTypePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.DependencyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.EnumerationLiteralPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.EnumerationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.GeneralizationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.InterfacePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.InterfaceRealizationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.OperationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PackageImportPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PackageMergePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PackagePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.ParameterPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PrimitiveTypePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PropertyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.RealizationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.SubstitutionPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.UsagePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.tool_palette.ClassToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.AbstractionEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.AssociationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.ClassNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.DataTypeNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.DependencyEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.EnumerationLiteralCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.EnumerationNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.GeneralizationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.InterfaceNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.InterfaceRealizationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.OperationCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PackageImportEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PackageMergeEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PackageNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PrimitiveTypeNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PropertyCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.RealizationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.SubstitutionEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.UsageEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.action.RequestTypeInformationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.action.SetTypeInformationAction;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.abstraction.CreateAbstractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.abstraction.DeleteAbstractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.abstraction.ReconnectAbstractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.abstraction.UpdateAbstractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.CreateAggregationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.CreateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.CreateCompositionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.DeleteAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.ReconnectAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.UpdateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.CreateDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.DeleteDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.UpdateDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.dependency.CreateDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.dependency.DeleteDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.dependency.ReconnectDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.dependency.UpdateDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.CreateEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.DeleteEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.UpdateEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.CreateEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.DeleteEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.UpdateEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.CreateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.DeleteGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.ReconnectGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.UpdateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.interface_realization.CreateInterfaceRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.interface_realization.DeleteInterfaceRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.interface_realization.ReconnectInterfaceRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.interface_realization.UpdateInterfaceRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.CreateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.DeleteOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.UpdateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_import.CreatePackageImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_import.DeletePackageImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_import.ReconnectPackageImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_import.UpdatePackageImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_merge.CreatePackageMergeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_merge.DeletePackageMergeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_merge.ReconnectPackageMergeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_merge.UpdatePackageMergeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.parameter.CreateParameterHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.parameter.DeleteParameterHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.parameter.UpdateParameterHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.CreatePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.DeletePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.UpdatePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.CreatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.DeletePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.realization.CreateRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.realization.DeleteRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.realization.ReconnectRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.realization.UpdateRealizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.substitution.CreateSubstitutionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.substitution.DeleteSubstitutionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.substitution.ReconnectSubstitutionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.substitution.UpdateSubstitutionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.CreateAbstractClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.CreateClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.DeleteClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.UpdateClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.CreateInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.DeleteInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.UpdateInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.CreatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.DeletePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.UpdatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.usage.CreateUsageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.usage.DeleteUsageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.usage.ReconnectUsageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.usage.UpdateUsageHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public final class ClassUmlManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution,
   DiagramDeleteHandlerContribution, DiagramLabelEditMapperContribution, SuffixIdAppenderContribution,
   DiagramElementPropertyMapperContribution, DiagramUpdateHandlerContribution,
   ClientActionContribution, ActionHandlerContribution, DiagramLabelEditValidatorContribution,
   DiagramReconnectEdgeHandlerContribution, PopupMapperContribution {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.CLASS;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration((nodes) -> {
         nodes.addBinding().to(UmlClass_Class.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_DataType.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_Enumeration.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_EnumerationLiteral.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_Interface.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_Operation.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_Package.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_Parameter.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_PrimitiveType.DiagramConfiguration.class);
         nodes.addBinding().to(UmlClass_Property.DiagramConfiguration.class);
      }, (edges) -> {
         edges.addBinding().to(UmlClass_Abstraction.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_Association.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_Dependency.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_Generalization.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_InterfaceRealization.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_PackageImport.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_PackageMerge.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_Realization.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_Substitution.DiagramConfiguration.class);
         edges.addBinding().to(UmlClass_Usage.DiagramConfiguration.class);
      });

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(ClassToolPaletteConfiguration.class);
      });
      contributeSuffixIdAppenders((contribution) -> {
         contribution.addBinding(PropertyMultiplicityLabelSuffix.SUFFIX)
            .to(PropertyMultiplicityLabelSuffix.class);
         contribution.addBinding(PropertyTypeLabelSuffix.SUFFIX).to(PropertyTypeLabelSuffix.class);
      });

      contributeClientActions((contribution) -> {
         contribution.addBinding().to(SetTypeInformationAction.class);
      });
      contributeActionHandlers((contribution) -> {
         contribution.addBinding().to(RequestTypeInformationHandler.class);
      });

      contributeDiagramCreateNodeHandlers((contribution) -> {
         contribution.addBinding().to(CreateAbstractClassHandler.class);
         contribution.addBinding().to(CreateClassHandler.class);
         contribution.addBinding().to(CreateDataTypeHandler.class);
         contribution.addBinding().to(CreateEnumerationHandler.class);
         contribution.addBinding().to(CreateEnumerationLiteralHandler.class);
         contribution.addBinding().to(CreateInterfaceHandler.class);
         contribution.addBinding().to(CreateOperationHandler.class);
         contribution.addBinding().to(CreatePackageHandler.class);
         contribution.addBinding().to(CreateParameterHandler.class);
         contribution.addBinding().to(CreatePrimitiveTypeHandler.class);
         contribution.addBinding().to(CreatePropertyHandler.class);
      });

      contributeDiagramCreateEdgeHandlers((contribution) -> {
         contribution.addBinding().to(CreateAbstractionHandler.class);
         contribution.addBinding().to(CreateAggregationHandler.class);
         contribution.addBinding().to(CreateAssociationHandler.class);
         contribution.addBinding().to(CreateCompositionHandler.class);
         contribution.addBinding().to(CreateDependencyHandler.class);
         contribution.addBinding().to(CreateGeneralizationHandler.class);
         contribution.addBinding().to(CreateInterfaceRealizationHandler.class);
         contribution.addBinding().to(CreatePackageImportHandler.class);
         contribution.addBinding().to(CreatePackageMergeHandler.class);
         contribution.addBinding().to(CreateRealizationHandler.class);
         contribution.addBinding().to(CreateSubstitutionHandler.class);
         contribution.addBinding().to(CreateUsageHandler.class);
      });

      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteAbstractionHandler.class);
         contribution.addBinding().to(DeleteAssociationHandler.class);
         contribution.addBinding().to(DeleteClassHandler.class);
         contribution.addBinding().to(DeleteDataTypeHandler.class);
         contribution.addBinding().to(DeleteDependencyHandler.class);
         contribution.addBinding().to(DeleteEnumerationHandler.class);
         contribution.addBinding().to(DeleteEnumerationLiteralHandler.class);
         contribution.addBinding().to(DeleteGeneralizationHandler.class);
         contribution.addBinding().to(DeleteInterfaceHandler.class);
         contribution.addBinding().to(DeleteInterfaceRealizationHandler.class);
         contribution.addBinding().to(DeleteOperationHandler.class);
         contribution.addBinding().to(DeletePackageHandler.class);
         contribution.addBinding().to(DeletePackageImportHandler.class);
         contribution.addBinding().to(DeletePackageMergeHandler.class);
         contribution.addBinding().to(DeleteParameterHandler.class);
         contribution.addBinding().to(DeletePrimitiveTypeHandler.class);
         contribution.addBinding().to(DeletePropertyHandler.class);
         contribution.addBinding().to(DeleteRealizationHandler.class);
         contribution.addBinding().to(DeleteSubstitutionHandler.class);
         contribution.addBinding().to(DeleteUsageHandler.class);
      });
      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateAbstractionHandler.class);
         contribution.addBinding().to(UpdateAssociationHandler.class);
         contribution.addBinding().to(UpdateClassHandler.class);
         contribution.addBinding().to(UpdateDataTypeHandler.class);
         contribution.addBinding().to(UpdateDependencyHandler.class);
         contribution.addBinding().to(UpdateEnumerationHandler.class);
         contribution.addBinding().to(UpdateEnumerationLiteralHandler.class);
         contribution.addBinding().to(UpdateGeneralizationHandler.class);
         contribution.addBinding().to(UpdateInterfaceHandler.class);
         contribution.addBinding().to(UpdateInterfaceRealizationHandler.class);
         contribution.addBinding().to(UpdateOperationHandler.class);
         contribution.addBinding().to(UpdatePackageHandler.class);
         contribution.addBinding().to(UpdatePackageImportHandler.class);
         contribution.addBinding().to(UpdatePackageMergeHandler.class);
         contribution.addBinding().to(UpdateParameterHandler.class);
         contribution.addBinding().to(UpdatePrimitiveTypeHandler.class);
         contribution.addBinding().to(UpdatePropertyHandler.class);
         contribution.addBinding().to(UpdateRealizationHandler.class);
         contribution.addBinding().to(UpdateSubstitutionHandler.class);
         contribution.addBinding().to(UpdateUsageHandler.class);
      });

      contributeGModelMappers((contribution) -> {
         contribution.addBinding().to(AbstractionEdgeMapper.class);
         contribution.addBinding().to(AssociationEdgeMapper.class);
         contribution.addBinding().to(ClassNodeMapper.class);
         contribution.addBinding().to(DataTypeNodeMapper.class);
         contribution.addBinding().to(DependencyEdgeMapper.class);
         contribution.addBinding().to(EnumerationNodeMapper.class);
         contribution.addBinding().to(EnumerationLiteralCompartmentMapper.class);
         contribution.addBinding().to(GeneralizationEdgeMapper.class);
         contribution.addBinding().to(InterfaceNodeMapper.class);
         contribution.addBinding().to(InterfaceRealizationEdgeMapper.class);
         contribution.addBinding().to(OperationCompartmentMapper.class);
         contribution.addBinding().to(PackageNodeMapper.class);
         contribution.addBinding().to(PackageImportEdgeMapper.class);
         contribution.addBinding().to(PackageMergeEdgeMapper.class);
         contribution.addBinding().to(PrimitiveTypeNodeMapper.class);
         contribution.addBinding().to(PropertyCompartmentMapper.class);
         contribution.addBinding().to(RealizationEdgeMapper.class);
         contribution.addBinding().to(SubstitutionEdgeMapper.class);
         contribution.addBinding().to(UsageEdgeMapper.class);
      });
      contributeDiagramLabelEditMappers((contribution) -> {
         contribution.addBinding().to(AssociationLabelEditMapper.class);
         contribution.addBinding().to(EnumerationLabelEditMapper.class);
         contribution.addBinding().to(EnumerationLiteralLabelEditMapper.class);
         contribution.addBinding().to(PropertyLabelEditMapper.class);
         contribution.addBinding().to(ClassLabelEditMapper.class);
         contribution.addBinding().to(InterfaceLabelEditMapper.class);
         contribution.addBinding().to(OperationLabelEditMapper.class);
         contribution.addBinding().to(DataTypeLabelEditMapper.class);
         contribution.addBinding().to(PrimitiveTypeLabelEditMapper.class);
         contribution.addBinding().to(PackageLabelEditMapper.class);
      });
      contributeDiagramElementPropertyMappers((contribution) -> {
         contribution.addBinding().to(AbstractionPropertyMapper.class);
         contribution.addBinding().to(AssociationPropertyMapper.class);
         contribution.addBinding().to(ClassPropertyMapper.class);
         contribution.addBinding().to(DataTypePropertyMapper.class);
         contribution.addBinding().to(DependencyPropertyMapper.class);
         contribution.addBinding().to(EnumerationLiteralPropertyMapper.class);
         contribution.addBinding().to(EnumerationPropertyMapper.class);
         contribution.addBinding().to(GeneralizationPropertyMapper.class);
         contribution.addBinding().to(InterfacePropertyMapper.class);
         contribution.addBinding().to(InterfaceRealizationPropertyMapper.class);
         contribution.addBinding().to(OperationPropertyMapper.class);
         contribution.addBinding().to(PackagePropertyMapper.class);
         contribution.addBinding().to(PackageImportPropertyMapper.class);
         contribution.addBinding().to(PackageMergePropertyMapper.class);
         contribution.addBinding().to(ParameterPropertyMapper.class);
         contribution.addBinding().to(PrimitiveTypePropertyMapper.class);
         contribution.addBinding().to(PropertyPropertyMapper.class);
         contribution.addBinding().to(RealizationPropertyMapper.class);
         contribution.addBinding().to(SubstitutionPropertyMapper.class);
         contribution.addBinding().to(UsagePropertyMapper.class);
      });

      contributeDiagramLabelEditValidators((contribution -> {
         contribution.addBinding().to(BlankLabelEditValidator.class);
         contribution.addBinding().to(PropertyLabelEditValidator.class);
      }));

      contributeDiagramReconnectEdgeHandlers((contribution) -> {
         contribution.addBinding().to(ReconnectAbstractionHandler.class);
         contribution.addBinding().to(ReconnectAssociationHandler.class);
         contribution.addBinding().to(ReconnectDependencyHandler.class);
         contribution.addBinding().to(ReconnectGeneralizationHandler.class);
         contribution.addBinding().to(ReconnectInterfaceRealizationHandler.class);
         contribution.addBinding().to(ReconnectPackageImportHandler.class);
         contribution.addBinding().to(ReconnectPackageMergeHandler.class);
         contribution.addBinding().to(ReconnectRealizationHandler.class);
         contribution.addBinding().to(ReconnectSubstitutionHandler.class);
         contribution.addBinding().to(ReconnectUsageHandler.class);
      });

      contributePopupMappers((contribution) -> {
         contribution.addBinding().to(ClassPopupMapper.class);
      });
   }
}

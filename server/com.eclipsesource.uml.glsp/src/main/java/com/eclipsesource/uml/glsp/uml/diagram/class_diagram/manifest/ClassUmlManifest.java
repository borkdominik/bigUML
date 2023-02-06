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
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.ClassDiagramConfiguration;
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
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.AssociationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.ClassPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.DataTypePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.EnumerationLiteralPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.EnumerationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.GeneralizationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.InterfacePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.OperationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PackagePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PrimitiveTypePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PropertyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.tool_palette.ClassToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.AssociationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.ClassNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.DataTypeNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.EnumerationLiteralCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.EnumerationNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.GeneralizationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.InterfaceNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.OperationCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PackageNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PrimitiveTypeNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.PropertyCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.CreateAggregationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.CreateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.CreateCompositionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.DeleteAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.CreateDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.DeleteDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.UpdateDataTypeNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.CreateEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.DeleteEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.UpdateEnumerationNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.CreateEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.DeleteEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.UpdateEnumerationLiteralNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.CreateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.DeleteGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.CreateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.DeleteOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.UpdateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.UpdateOperationNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.CreatePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.DeletePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.UpdatePrimitiveTypeNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.CreatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.DeletePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyMultiplicityHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.CreateAbstractClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.CreateClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.DeleteClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.UpdateClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.UpdateClassNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.CreateInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.DeleteInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.UpdateInterfaceNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.CreatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.DeletePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.UpdatePackageNameHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public final class ClassUmlManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution,
   DiagramDeleteHandlerContribution, DiagramLabelEditMapperContribution, SuffixIdAppenderContribution,
   DiagramElementPropertyMapperContribution, DiagramUpdateHandlerContribution {

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

      contributeDiagramConfiguration(() -> ClassDiagramConfiguration.class);
      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(ClassToolPaletteConfiguration.class);
      });
      contributeSuffixIdAppenders((contribution) -> {
         contribution.addBinding(PropertyMultiplicityLabelSuffix.SUFFIX)
            .to(PropertyMultiplicityLabelSuffix.class);
         contribution.addBinding(PropertyTypeLabelSuffix.SUFFIX).to(PropertyTypeLabelSuffix.class);
      });

      contributeDiagramCreateHandlers((contribution) -> {
         contribution.addBinding().to(CreateAggregationHandler.class);
         contribution.addBinding().to(CreateAssociationHandler.class);
         contribution.addBinding().to(CreateCompositionHandler.class);
         contribution.addBinding().to(CreateEnumerationHandler.class);
         contribution.addBinding().to(CreateEnumerationLiteralHandler.class);
         contribution.addBinding().to(CreateGeneralizationHandler.class);
         contribution.addBinding().to(CreatePropertyHandler.class);
         contribution.addBinding().to(CreateAbstractClassHandler.class);
         contribution.addBinding().to(CreateClassHandler.class);
         contribution.addBinding().to(CreateInterfaceHandler.class);
         contribution.addBinding().to(CreateOperationHandler.class);
         contribution.addBinding().to(CreateDataTypeHandler.class);
         contribution.addBinding().to(CreatePrimitiveTypeHandler.class);
         contribution.addBinding().to(CreatePackageHandler.class);
      });
      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteAssociationHandler.class);
         contribution.addBinding().to(DeleteEnumerationHandler.class);
         contribution.addBinding().to(DeleteEnumerationLiteralHandler.class);
         contribution.addBinding().to(DeleteGeneralizationHandler.class);
         contribution.addBinding().to(DeletePropertyHandler.class);
         contribution.addBinding().to(DeleteClassHandler.class);
         contribution.addBinding().to(DeleteInterfaceHandler.class);
         contribution.addBinding().to(DeleteOperationHandler.class);
         contribution.addBinding().to(DeleteDataTypeHandler.class);
         contribution.addBinding().to(DeletePrimitiveTypeHandler.class);
         contribution.addBinding().to(DeletePackageHandler.class);
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
      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateDataTypeNameHandler.class);
         contribution.addBinding().to(UpdateEnumerationNameHandler.class);
         contribution.addBinding().to(UpdateEnumerationLiteralNameHandler.class);
         contribution.addBinding().to(UpdateOperationNameHandler.class);
         contribution.addBinding().to(UpdateOperationHandler.class);
         contribution.addBinding().to(UpdatePrimitiveTypeNameHandler.class);
         contribution.addBinding().to(UpdatePropertyNameHandler.class);
         contribution.addBinding().to(UpdatePropertyMultiplicityHandler.class);
         contribution.addBinding().to(UpdatePropertyTypeHandler.class);
         contribution.addBinding().to(UpdateClassNameHandler.class);
         contribution.addBinding().to(UpdateClassHandler.class);
         contribution.addBinding().to(UpdateInterfaceNameHandler.class);
         contribution.addBinding().to(UpdatePackageNameHandler.class);
      });
      contributeGModelMappers((contribution) -> {
         contribution.addBinding().to(AssociationEdgeMapper.class);
         contribution.addBinding().to(ClassNodeMapper.class);
         contribution.addBinding().to(EnumerationNodeMapper.class);
         contribution.addBinding().to(EnumerationLiteralCompartmentMapper.class);
         contribution.addBinding().to(GeneralizationEdgeMapper.class);
         contribution.addBinding().to(InterfaceNodeMapper.class);
         contribution.addBinding().to(PropertyCompartmentMapper.class);
         contribution.addBinding().to(OperationCompartmentMapper.class);
         contribution.addBinding().to(DataTypeNodeMapper.class);
         contribution.addBinding().to(PrimitiveTypeNodeMapper.class);
         contribution.addBinding().to(PackageNodeMapper.class);
      });

      contributeDiagramElementPropertyMappers((contribution) -> {
         contribution.addBinding().to(AssociationPropertyMapper.class);
         contribution.addBinding().to(ClassPropertyMapper.class);
         contribution.addBinding().to(DataTypePropertyMapper.class);
         contribution.addBinding().to(EnumerationLiteralPropertyMapper.class);
         contribution.addBinding().to(EnumerationPropertyMapper.class);
         contribution.addBinding().to(GeneralizationPropertyMapper.class);
         contribution.addBinding().to(InterfacePropertyMapper.class);
         contribution.addBinding().to(OperationPropertyMapper.class);
         contribution.addBinding().to(PackagePropertyMapper.class);
         contribution.addBinding().to(PrimitiveTypePropertyMapper.class);
         contribution.addBinding().to(PropertyPropertyMapper.class);
      });
   }
}

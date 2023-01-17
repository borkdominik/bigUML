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
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.ClassDiagramConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette.PackagePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.toolpalette.ClassToolPaletteConfiguration;
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
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.SetAssociationEndBoundsHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association.SetAssociationEndNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.CreateDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.DeleteDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.RenameDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.CreateEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.DeleteEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration.RenameEnumerationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.CreateEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.DeleteEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal.RenameEnumerationLiteralHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.CreateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization.DeleteGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.CreateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.DeleteOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.RenameOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.CreatePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.DeletePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type.RenamePrimitiveTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.CreatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.DeletePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.RenamePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyMultiplicityHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property.UpdatePropertyTypeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.CreateAbstractClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.CreateClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.DeleteClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass.RenameClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.CreateInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.DeleteInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uinterface.RenameInterfaceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.CreatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.DeletePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.RenamePackageHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public final class ClassUmlManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution,
   DiagramDeleteHandlerContribution, DiagramLabelEditHandlerContribution, SuffixIdAppenderContribution,
   DiagramElementPropertyMapperContribution {

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
      contributeDiagramLabelEditHandlers((contribution) -> {
         contribution.addBinding().to(SetAssociationEndBoundsHandler.class);
         contribution.addBinding().to(SetAssociationEndNameHandler.class);
         contribution.addBinding().to(RenameEnumerationHandler.class);
         contribution.addBinding().to(RenameEnumerationLiteralHandler.class);
         contribution.addBinding().to(RenamePropertyHandler.class);
         contribution.addBinding().to(UpdatePropertyMultiplicityHandler.class);
         contribution.addBinding().to(UpdatePropertyTypeHandler.class);
         contribution.addBinding().to(RenameClassHandler.class);
         contribution.addBinding().to(RenameInterfaceHandler.class);
         contribution.addBinding().to(RenameOperationHandler.class);
         contribution.addBinding().to(RenameDataTypeHandler.class);
         contribution.addBinding().to(RenamePrimitiveTypeHandler.class);
         contribution.addBinding().to(RenamePackageHandler.class);
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

      contributeDiagramElementPropertyMapper((contribution) -> {
         contribution.addBinding().to(PackagePropertyMapper.class);
      });
   }
}

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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.manifest;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Class;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.label_edit.ClassLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette.ClassPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel.ClassNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.uclass.CreateClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.uclass.DeleteClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.uclass.UpdateClassHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Dependency;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_ElementImport;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Package;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_PackageImport;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_PackageMerge;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.label_edit.PackageLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette.DependencyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette.ElementImportPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette.PackageImportPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette.PackageMergePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette.PackagePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.tool_palette.PackageToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel.DependencyEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel.ElementImportEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel.PackageImportEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel.PackageMergeEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel.PackageNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.dependency.CreateDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.dependency.DeleteDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.dependency.UpdateDependencyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.element_import.CreateElementImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.element_import.DeleteElementImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.element_import.UpdateElementImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.package_import.CreatePackageImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.package_import.DeletePackageImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.package_import.UpdatePackageImportHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.package_merge.CreatePackageMergeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.package_merge.DeletePackageMergeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.package_merge.UpdatePackageMergeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.upackage.CreatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.upackage.DeletePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.upackage.UpdatePackageHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class PackageManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution, DiagramDeleteHandlerContribution,
   DiagramElementPropertyMapperContribution, DiagramLabelEditMapperContribution,
   DiagramUpdateHandlerContribution {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.PACKAGE;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration((nodes) -> {
         nodes.addBinding().to(UmlPackage_Package.DiagramConfiguration.class);
         nodes.addBinding().to(UmlPackage_Class.DiagramConfiguration.class);
      }, (edges) -> {
         edges.addBinding().to(UmlPackage_Dependency.DiagramConfiguration.class);
         edges.addBinding().to(UmlPackage_ElementImport.DiagramConfiguration.class);
         edges.addBinding().to(UmlPackage_PackageImport.DiagramConfiguration.class);
         edges.addBinding().to(UmlPackage_PackageMerge.DiagramConfiguration.class);
      });

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(PackageToolPaletteConfiguration.class);
      });

      contributeGModelMappers((contributions) -> {
         contributions.addBinding().to(ClassNodeMapper.class);
         contributions.addBinding().to(DependencyEdgeMapper.class);
         contributions.addBinding().to(ElementImportEdgeMapper.class);
         contributions.addBinding().to(PackageNodeMapper.class);
         contributions.addBinding().to(PackageImportEdgeMapper.class);
         contributions.addBinding().to(PackageMergeEdgeMapper.class);
      });

      contributeDiagramCreateHandlers((contribution) -> {
         contribution.addBinding().to(CreateClassHandler.class);
         contribution.addBinding().to(CreateDependencyHandler.class);
         contribution.addBinding().to(CreatePackageHandler.class);
         contribution.addBinding().to(CreateElementImportHandler.class);
         contribution.addBinding().to(CreatePackageImportHandler.class);
         contribution.addBinding().to(CreatePackageMergeHandler.class);
      });
      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateClassHandler.class);
         contribution.addBinding().to(UpdateDependencyHandler.class);
         contribution.addBinding().to(UpdatePackageHandler.class);
         contribution.addBinding().to(UpdateElementImportHandler.class);
         contribution.addBinding().to(UpdatePackageImportHandler.class);
         contribution.addBinding().to(UpdatePackageMergeHandler.class);
      });
      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteClassHandler.class);
         contribution.addBinding().to(DeleteDependencyHandler.class);
         contribution.addBinding().to(DeletePackageHandler.class);
         contribution.addBinding().to(DeleteElementImportHandler.class);
         contribution.addBinding().to(DeletePackageImportHandler.class);
         contribution.addBinding().to(DeletePackageMergeHandler.class);
      });

      contributeDiagramLabelEditMappers((contribution) -> {
         contribution.addBinding().to(ClassLabelEditMapper.class);
         contribution.addBinding().to(PackageLabelEditMapper.class);
      });

      contributeDiagramElementPropertyMappers((contribution) -> {
         contribution.addBinding().to(ClassPropertyMapper.class);
         contribution.addBinding().to(DependencyPropertyMapper.class);
         contribution.addBinding().to(PackagePropertyMapper.class);
         contribution.addBinding().to(ElementImportPropertyMapper.class);
         contribution.addBinding().to(PackageImportPropertyMapper.class);
         contribution.addBinding().to(PackageMergePropertyMapper.class);
      });
   }
}

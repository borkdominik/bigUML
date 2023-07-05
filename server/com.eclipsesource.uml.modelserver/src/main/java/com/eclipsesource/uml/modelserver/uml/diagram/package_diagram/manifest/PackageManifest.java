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
package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.manifest;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.uclass.CreateClassContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.uclass.DeleteClassContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.uclass.UpdateClassContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.dependency.CreateDependencyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.dependency.DeleteDependencyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.dependency.UpdateDependencyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.element_import.CreateElementImportContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.element_import.DeleteElementImportContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.element_import.UpdateElementImportContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import.CreatePackageImportContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import.DeletePackageImportContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import.UpdatePackageImportContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_merge.CreatePackageMergeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_merge.DeletePackageMergeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_merge.UpdatePackageMergeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.upackage.CreatePackageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.upackage.DeletePackageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.upackage.UpdatePackageContribution;

public class PackageManifest extends DiagramManifest implements CommandCodecContribution {
   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), (contributions) -> {
         // Package
         contributions.addBinding(CreateClassContribution.TYPE).to(CreateClassContribution.class);
         contributions.addBinding(UpdateClassContribution.TYPE).to(UpdateClassContribution.class);
         contributions.addBinding(DeleteClassContribution.TYPE).to(DeleteClassContribution.class);
         // Package
         contributions.addBinding(CreatePackageContribution.TYPE).to(CreatePackageContribution.class);
         contributions.addBinding(UpdatePackageContribution.TYPE).to(UpdatePackageContribution.class);
         contributions.addBinding(DeletePackageContribution.TYPE).to(DeletePackageContribution.class);
         // Dependency
         contributions.addBinding(CreateDependencyContribution.TYPE).to(CreateDependencyContribution.class);
         contributions.addBinding(UpdateDependencyContribution.TYPE).to(UpdateDependencyContribution.class);
         contributions.addBinding(DeleteDependencyContribution.TYPE).to(DeleteDependencyContribution.class);
         // Package Import
         contributions.addBinding(CreatePackageImportContribution.TYPE).to(CreatePackageImportContribution.class);
         contributions.addBinding(UpdatePackageImportContribution.TYPE).to(UpdatePackageImportContribution.class);
         contributions.addBinding(DeletePackageImportContribution.TYPE).to(DeletePackageImportContribution.class);
         // Package Merge
         contributions.addBinding(CreatePackageMergeContribution.TYPE).to(CreatePackageMergeContribution.class);
         contributions.addBinding(UpdatePackageMergeContribution.TYPE).to(UpdatePackageMergeContribution.class);
         contributions.addBinding(DeletePackageMergeContribution.TYPE).to(DeletePackageMergeContribution.class);
         // Element Import
         contributions.addBinding(CreateElementImportContribution.TYPE).to(CreateElementImportContribution.class);
         contributions.addBinding(UpdateElementImportContribution.TYPE).to(UpdateElementImportContribution.class);
         contributions.addBinding(DeleteElementImportContribution.TYPE).to(DeleteElementImportContribution.class);
      });
   }
}

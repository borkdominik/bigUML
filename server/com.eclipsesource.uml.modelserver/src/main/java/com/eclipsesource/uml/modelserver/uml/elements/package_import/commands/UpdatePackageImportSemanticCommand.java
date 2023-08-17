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
package com.eclipsesource.uml.modelserver.uml.elements.package_import.commands;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public class UpdatePackageImportSemanticCommand
   extends BaseUpdateSemanticElementCommand<PackageImport, UpdatePackageImportArgument> {

   public UpdatePackageImportSemanticCommand(final ModelContext context,
      final PackageImport semanticElement,
      final UpdatePackageImportArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final PackageImport semanticElement,
      final UpdatePackageImportArgument updateArgument) {
      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });

      updateArgument.nearestPackageId().ifPresent(arg -> {
         semanticElement.getNearestPackage().getPackageImports().remove(semanticElement);

         var nearestPackage = semanticElementAccessor.getElement(arg, Package.class).get();
         nearestPackage.getPackageImports().add(semanticElement);
      });

      updateArgument.importedPackageId().ifPresent(arg -> {
         semanticElement.setImportedPackage(semanticElementAccessor.getElement(arg, Package.class).get());
      });
   }

}

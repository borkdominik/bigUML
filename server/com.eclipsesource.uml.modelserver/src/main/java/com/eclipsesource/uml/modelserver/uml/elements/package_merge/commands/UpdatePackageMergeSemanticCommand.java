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
package com.eclipsesource.uml.modelserver.uml.elements.package_merge.commands;

import java.util.List;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementSemanticCommand;

public class UpdatePackageMergeSemanticCommand
   extends BaseUpdateSemanticElementCommand<PackageMerge, UpdatePackageMergeArgument> {

   public UpdatePackageMergeSemanticCommand(final ModelContext context,
      final PackageMerge semanticElement,
      final UpdatePackageMergeArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final PackageMerge semanticElement,
      final UpdatePackageMergeArgument updateArgument) {
      include(List.of(new UpdateElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.nearestPackageId().ifPresent(arg -> {
         semanticElement.getNearestPackage().getPackageMerges().remove(semanticElement);

         var nearestPackage = semanticElementAccessor.getElement(arg, Package.class).get();
         nearestPackage.getPackageMerges().add(semanticElement);
      });

      updateArgument.mergedPackageId().ifPresent(arg -> {
         semanticElement.setMergedPackage(semanticElementAccessor.getElement(arg, Package.class).get());
      });
   }

}

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
package com.eclipsesource.uml.modelserver.uml.elements.package_import.behavior;

import java.util.List;

import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.reconnect.BaseReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.elements.package_import.commands.UpdatePackageImportArgument;

public class PackageImportReconnectBehavior<TElement extends PackageImport>
   extends BaseReconnectBehavior<TElement> {

   @Override
   protected UpdatePackageImportArgument argument(final ModelContext context, final TElement element,
      final List<String> sources,
      final List<String> targets) {
      var nearestPackage = sources.get(0);
      var importedPackage = targets.get(0);

      return UpdatePackageImportArgument.by().nearestPackageId(nearestPackage).importedPackageId(importedPackage)
         .build();
   }
}

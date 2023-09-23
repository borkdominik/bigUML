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
package com.eclipsesource.uml.modelserver.uml.elements.package_merge.behavior;

import java.util.List;

import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.reconnect.BaseReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.elements.package_merge.commands.UpdatePackageMergeArgument;

public class PackageMergeReconnectBehavior<TElement extends PackageMerge>
   extends BaseReconnectBehavior<TElement> {

   @Override
   protected UpdatePackageMergeArgument argument(final ModelContext context, final TElement element,
      final List<String> sources,
      final List<String> targets) {
      var nearestPackage = sources.get(0);
      var mergedPackage = targets.get(0);

      return UpdatePackageMergeArgument.by().nearestPackageId(nearestPackage).mergedPackageId(mergedPackage).build();
   }
}

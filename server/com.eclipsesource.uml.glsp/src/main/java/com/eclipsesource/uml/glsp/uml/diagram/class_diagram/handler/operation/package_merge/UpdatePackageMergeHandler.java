/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.package_merge;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PackageMerge;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_merge.UpdatePackageMergeArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_merge.UpdatePackageMergeContribution;

public final class UpdatePackageMergeHandler
   extends BaseUpdateElementHandler<PackageMerge, UpdatePackageMergeArgument> {

   public UpdatePackageMergeHandler() {
      super(UmlClass_PackageMerge.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final PackageMerge element,
      final UpdatePackageMergeArgument updateArgument) {
      return UpdatePackageMergeContribution.create(element, updateArgument);
   }
}

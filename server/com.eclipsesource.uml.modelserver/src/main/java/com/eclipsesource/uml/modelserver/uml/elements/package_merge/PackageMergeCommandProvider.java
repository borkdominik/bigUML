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
package com.eclipsesource.uml.modelserver.uml.elements.package_merge;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageMerge;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.package_merge.commands.CreatePackageMergeSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.package_merge.commands.UpdatePackageMergeArgument;
import com.eclipsesource.uml.modelserver.uml.elements.package_merge.commands.UpdatePackageMergeSemanticCommand;

public class PackageMergeCommandProvider extends EdgeCommandProvider<PackageMerge, Package, Package> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Package source,
      final Package target) {
      var semantic = new CreatePackageMergeSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final PackageMerge element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdatePackageMergeArgument.class);
      return List.of(new UpdatePackageMergeSemanticCommand(context, element, update));
   }

}

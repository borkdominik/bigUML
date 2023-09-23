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
package com.eclipsesource.uml.modelserver.uml.elements.dependency;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.dependency.commands.CreateDependencySemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.dependency.commands.UpdateDependencyArgument;
import com.eclipsesource.uml.modelserver.uml.elements.dependency.commands.UpdateDependencySemanticCommand;

public class DependencyCommandProvider extends EdgeCommandProvider<Dependency, NamedElement, NamedElement> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final NamedElement source,
      final NamedElement target) {
      var semantic = new CreateDependencySemanticCommand(
         context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Dependency element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateDependencyArgument.class);
      return List.of(new UpdateDependencySemanticCommand(context, element, update));
   }
}

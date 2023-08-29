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
package com.eclipsesource.uml.modelserver.uml.elements.usage;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.usage.commands.CreateUsageSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.usage.commands.UpdateUsageArgument;
import com.eclipsesource.uml.modelserver.uml.elements.usage.commands.UpdateUsageSemanticCommand;

public class UsageCommandProvider extends EdgeCommandProvider<Usage, NamedElement, NamedElement> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final NamedElement source,
      final NamedElement target) {
      var semantic = new CreateUsageSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Usage element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateUsageArgument.class);
      return List.of(new UpdateUsageSemanticCommand(context, element, update));
   }

}

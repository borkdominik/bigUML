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
package com.eclipsesource.uml.modelserver.uml.elements.association;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.CreateAssociationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.CreateAssociationSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.UpdateAssociationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.association.commands.UpdateAssociationSemanticCommand;

public class AssociationCommandProvider extends EdgeCommandProvider<Association, Type, Type> {
   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Type source,
      final Type target) {
      var argument = context.decoder().embedJson(CreateAssociationArgument.class,
         new CreateAssociationArgument.Deserializer());
      var semantic = new CreateAssociationSemanticCommand(context, source,
         target, argument);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Association element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateAssociationArgument.class);
      return List.of(new UpdateAssociationSemanticCommand(context, element, update));
   }
}

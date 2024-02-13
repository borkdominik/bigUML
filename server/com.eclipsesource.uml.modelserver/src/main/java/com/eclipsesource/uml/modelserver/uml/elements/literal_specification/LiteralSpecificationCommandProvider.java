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
package com.eclipsesource.uml.modelserver.uml.elements.literal_specification;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.LiteralBoolean;
import org.eclipse.uml2.uml.LiteralInteger;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.LiteralString;
import org.eclipse.uml2.uml.LiteralUnlimitedNatural;
import org.eclipse.uml2.uml.Slot;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.AddLiteralSpecificationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.AddLiteralSpecificationSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.UpdateLiteralSpecificationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.UpdateLiteralSpecificationSemanticCommand;

public class LiteralSpecificationCommandProvider extends NodeCommandProvider<LiteralSpecification, Slot> {

   @Override
   public Set<Class<? extends LiteralSpecification>> getElementTypes() {
      return Set.of(getElementType(), LiteralBoolean.class, LiteralString.class, LiteralInteger.class,
         LiteralUnlimitedNatural.class);
   }

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Slot parent,
      final GPoint position) {
      var decoder = context.decoder();
      var argument = decoder.embedJson(AddLiteralSpecificationArgument.class,
         new AddLiteralSpecificationArgument.Deserializer());
      var semantic = new AddLiteralSpecificationSemanticCommand(context, parent, argument);
      return List.of(semantic);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final LiteralSpecification element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateLiteralSpecificationArgument.class);
      return List.of(new UpdateLiteralSpecificationSemanticCommand(context, element, update));
   }
}

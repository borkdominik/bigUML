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

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.Slot;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.AddLiteralSpecificationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands.AddLiteralSpecificationSemanticCommand;

public class LiteralSpecificationCommandProvider extends NodeCommandProvider<LiteralSpecification, Slot> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Slot parent,
      final GPoint position) {
      var decoder = context.decoder();
      var argument = decoder.embedJson(AddLiteralSpecificationArgument.class);
      var semantic = new AddLiteralSpecificationSemanticCommand(context, parent, argument);
      return List.of(semantic);
   }
}

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
package com.eclipsesource.uml.modelserver.uml.elements.association.commands;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public final class CreateAssociationSemanticCommand extends BaseCreateSemanticRelationCommand<Association, Type, Type> {

   private final CreateAssociationArgument argument;

   public CreateAssociationSemanticCommand(final ModelContext context,
      final Type source, final Type target, final CreateAssociationArgument argument) {
      super(context, source, target);
      this.argument = argument;
   }

   @Override
   protected Association createSemanticElement(final Type source, final Type target) {
      return source.createAssociation(true,
         argument.type.toAggregationKind(),
         target.getName(),
         1, 1,
         target,
         true,
         AggregationKind.NONE_LITERAL,
         source.getName(),
         1, 1);
   }
}

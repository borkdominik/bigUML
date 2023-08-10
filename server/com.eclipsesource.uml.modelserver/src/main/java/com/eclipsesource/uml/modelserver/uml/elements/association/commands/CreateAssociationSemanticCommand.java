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
package com.eclipsesource.uml.modelserver.uml.elements.association.commands;

import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;

public class CreateAssociationSemanticCommand extends BaseCreateSemanticRelationCommand<Association, Actor, UseCase> {

   public CreateAssociationSemanticCommand(final ModelContext context,
      final Actor source, final UseCase target) {
      super(context, source, target);
   }

   @Override
   protected Association createSemanticElement(final Actor source, final UseCase target) {
      return source.createAssociation(true,
         AggregationKind.NONE_LITERAL,
         target.getName(),
         1, 1,
         target,
         true,
         AggregationKind.NONE_LITERAL,
         source.getName(),
         1, 1);
   }
}

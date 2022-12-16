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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator.AssociationEndNameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public class AddAssociationSemanticCommand extends CreateSemanticRelationCommand<Type, Type, Association> {

   protected final AssociationType type;
   protected final ContextualNameGenerator<Type> nameGenerator;

   public AddAssociationSemanticCommand(final ModelContext context,
      final Type source, final Type target, final AssociationType type) {
      super(context, source, target);
      this.type = type;
      this.nameGenerator = new AssociationEndNameGenerator();
   }

   @Override
   protected Association createSemanticElement(final Type source, final Type target) {
      return source.createAssociation(true,
         AggregationKind.NONE_LITERAL,
         nameGenerator.newNameInContextOf(target),
         1, 1,
         target,
         true,
         type.toAggregationKind(),
         nameGenerator.newNameInContextOf(source),
         1, 1);
   }
}

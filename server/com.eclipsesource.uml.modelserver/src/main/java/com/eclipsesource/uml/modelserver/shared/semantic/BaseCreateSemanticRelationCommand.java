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
package com.eclipsesource.uml.modelserver.shared.semantic;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class BaseCreateSemanticRelationCommand<TSource, TTarget, TRelation> extends BaseSemanticElementCommand
   implements SemanticElementSupplier<TRelation> {

   protected TRelation newSemanticElement;
   protected final TSource source;
   protected final TTarget target;

   public BaseCreateSemanticRelationCommand(final ModelContext context, final TSource source, final TTarget target) {
      super(context);
      this.source = source;
      this.target = target;
   }

   @Override
   protected void doExecute() {
      newSemanticElement = createSemanticElement(source, target);
   }

   @Override
   public TRelation getSemanticElement() { return newSemanticElement; }

   /**
    * Creates the semantic element and connects it with the source and target
    *
    * @param source Source of the relation
    * @param target Target of the relation
    * @return The new created semantic element
    */
   abstract protected TRelation createSemanticElement(TSource source, TTarget target);
}

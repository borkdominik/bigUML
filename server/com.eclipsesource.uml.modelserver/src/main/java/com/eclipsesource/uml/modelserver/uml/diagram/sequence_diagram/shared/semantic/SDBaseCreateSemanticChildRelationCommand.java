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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.shared.semantic;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseSemanticElementCommand;
import com.eclipsesource.uml.modelserver.shared.semantic.SemanticElementSupplier;

public abstract class SDBaseCreateSemanticChildRelationCommand<TParent, TChild, TSource, TTarget>
   extends BaseSemanticElementCommand
   implements SemanticElementSupplier<TChild> {

   protected TChild newSemanticElement;
   protected final TParent parent;
   protected final TSource source;
   protected final TTarget target;

   public SDBaseCreateSemanticChildRelationCommand(final ModelContext context, final TParent parent,
      final TSource source,
      final TTarget target) {
      super(context);
      this.parent = parent;
      this.source = source;
      this.target = target;
   }

   @Override
   protected void doExecute() {
      newSemanticElement = createSemanticElement(parent, source, target);
   }

   @Override
   public TChild getSemanticElement() { return newSemanticElement; }

   /**
    * Creates the semantic element and adds it to the parent
    *
    * @param parent Parent to which the created element should be added to
    * @return The new created semantic element
    */
   abstract protected TChild createSemanticElement(TParent parent, final TSource source, final TTarget target);

}

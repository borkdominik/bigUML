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
package com.eclipsesource.uml.modelserver.shared.semantic;

import java.util.List;
import java.util.function.Supplier;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class BaseUpdateSemanticElementCommand<TSemanticElement extends EObject, TUpdateArgument>
   extends BaseSemanticElementCommand {

   protected Supplier<TSemanticElement> semanticElementSupplier;
   protected TUpdateArgument updateArgument;

   public BaseUpdateSemanticElementCommand(final ModelContext context, final TSemanticElement semanticElement,
      final TUpdateArgument updateArgument) {
      this(context, () -> semanticElement, updateArgument);
   }

   public BaseUpdateSemanticElementCommand(final ModelContext context,
      final Supplier<TSemanticElement> semanticElementSupplier,
      final TUpdateArgument updateArgument) {
      super(context);
      this.semanticElementSupplier = semanticElementSupplier;
      this.updateArgument = updateArgument;
   }

   @Override
   protected void doExecute() {
      updateSemanticElement(this.semanticElementSupplier.get(), this.updateArgument);
   }

   /**
    * Updates the semantic element with the provided argument
    *
    * @param semanticElement Semantic element which will be updated
    * @param updateArgument  Argument with the changes
    */
   protected abstract void updateSemanticElement(final TSemanticElement semanticElement,
      final TUpdateArgument updateArgument);

   protected void include(
      final List<BaseUpdateSemanticElementCommand<? super TSemanticElement, ? super TUpdateArgument>> commands) {
      commands.forEach(c -> c.doExecute());
   }

}

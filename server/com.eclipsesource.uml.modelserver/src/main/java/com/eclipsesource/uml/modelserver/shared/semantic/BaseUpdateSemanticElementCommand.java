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

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class BaseUpdateSemanticElementCommand<TSemanticElement extends EObject, TUpdateArgument>
   extends BaseSemanticElementCommand {

   protected TSemanticElement semanticElement;
   protected TUpdateArgument updateArgument;

   public BaseUpdateSemanticElementCommand(final ModelContext context, final TSemanticElement semanticElement,
      final TUpdateArgument updateArgument) {
      super(context);
      this.semanticElement = semanticElement;
      this.updateArgument = updateArgument;
   }

   @Override
   protected void doExecute() {
      updateSemanticElement(this.semanticElement, this.updateArgument);
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

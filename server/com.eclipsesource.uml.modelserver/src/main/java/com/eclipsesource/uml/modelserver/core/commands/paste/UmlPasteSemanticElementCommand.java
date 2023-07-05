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
package com.eclipsesource.uml.modelserver.core.commands.paste;

import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseSemanticElementCommand;

public class UmlPasteSemanticElementCommand extends BaseSemanticElementCommand {

   protected final Element newSemanticElement;
   protected final Element original;

   public UmlPasteSemanticElementCommand(final ModelContext context, final Element original,
      final Element newSemanticElement) {
      super(context);

      this.newSemanticElement = newSemanticElement;
      this.original = original;
   }

   @Override
   protected void doExecute() {
      if (newSemanticElement instanceof NamedElement) {
         var newSemanticNamedElement = (NamedElement) newSemanticElement;

         if (newSemanticNamedElement.getName() != null) {
            newSemanticNamedElement.setName(newSemanticNamedElement.getName() + "_copy");
         }
      }

      if (newSemanticElement instanceof PackageableElement) {
         original.getModel().getPackagedElements()
            .add((PackageableElement) newSemanticElement);
      }
   }
}

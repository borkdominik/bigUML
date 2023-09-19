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
package com.eclipsesource.uml.modelserver.uml.elements.element_import.commands;

import java.util.List;

import org.eclipse.uml2.uml.ElementImport;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementSemanticCommand;

public class UpdateElementImportSemanticCommand
   extends BaseUpdateSemanticElementCommand<ElementImport, UpdateElementImportArgument> {

   public UpdateElementImportSemanticCommand(final ModelContext context,
      final ElementImport semanticElement,
      final UpdateElementImportArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final ElementImport semanticElement,
      final UpdateElementImportArgument updateArgument) {
      include(List.of(new UpdateElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });
      updateArgument.alias().ifPresent(arg -> {
         if (arg.length() > 0) {
            semanticElement.setAlias(arg);
         } else {
            semanticElement.unsetAlias();
         }
      });
   }

}

/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.element_import.features;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.ElementImport;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ElementImportPropertyProvider extends BGEMFElementPropertyProvider<ElementImport> {
   public static final String ALIAS = "alias";

   @Inject
   public ElementImportPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(ALIAS));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final ElementImport element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .text(ALIAS, "Alias", element.getAlias());

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final ElementImport element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<ElementImport> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case ALIAS:
                  e.setAlias(value);
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }
}

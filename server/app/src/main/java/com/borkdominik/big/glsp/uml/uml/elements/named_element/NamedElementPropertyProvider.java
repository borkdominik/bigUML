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
package com.borkdominik.big.glsp.uml.uml.elements.named_element;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.VisibilityKind;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.element.VisibilityKindUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class NamedElementPropertyProvider extends BGEMFElementPropertyProvider<NamedElement> {

   public static final String NAME = "name";
   public static final String VISIBILITY_KIND = "visibilityKind";

   @Inject
   public NamedElementPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(NAME, VISIBILITY_KIND));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final NamedElement element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .text(NAME, "Name", element.getName())
         .choice(
            VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            element.getVisibility().getLiteral());

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final NamedElement element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<NamedElement> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case NAME:
                  e.setName(value);
                  break;
               case VISIBILITY_KIND:
                  e.setVisibility(VisibilityKind.get(value));
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }

}

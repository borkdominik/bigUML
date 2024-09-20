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
package com.borkdominik.big.glsp.uml.uml.elements.typed_element;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.TypedElement;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.type.TypeInformationProvider;
import com.borkdominik.big.glsp.uml.uml.elements.type.TypeUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class TypedElementPropertyProvider extends BGEMFElementPropertyProvider<TypedElement> {

   public static final String TYPE = "type";

   @Inject
   protected TypeInformationProvider typeProvider;

   @Inject
   public TypedElementPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(TYPE));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final TypedElement element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .choice(
            TYPE,
            "Type",
            TypeUtils
               .asChoices(typeProvider.provide().stream()
                  .filter(type -> this.modelState.getIndex().getEObject(type.getId())
                     .map(t -> {
                        if (t instanceof NamedElement namedElement) {
                           if (namedElement.getName() != null && !namedElement.getName().isBlank()) {
                              return true;
                           }
                        }

                        return null;
                     })
                     .isPresent())
                  .collect(Collectors.toSet())),
            element.getType() == null ? "" : idGenerator.getOrCreateId(element.getType()));

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final TypedElement element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<TypedElement> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case TYPE:
                  e.setType(modelState.getElementIndex().get(value, Type.class).orElse(null));
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }

}

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
package com.borkdominik.big.glsp.uml.uml.elements.parameter.features;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.ParameterDirectionKind;
import org.eclipse.uml2.uml.ParameterEffectKind;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.utils.ParameterDirectionKindUtils;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.utils.ParameterEffectKindUtils;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ParameterPropertyProvider extends BGEMFElementPropertyProvider<Parameter> {

   public static final String IS_EXCEPTION = "isException";
   public static final String IS_STREAM = "isStream";
   public static final String DIRECTION = "direction";
   public static final String EFFECT = "effect";

   @Inject
   public ParameterPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(IS_EXCEPTION, IS_STREAM, DIRECTION, EFFECT));
   }

   @Override
   public List<ElementPropertyItem> doProvide(final Parameter element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .bool(IS_EXCEPTION, "Is exception", element.isException())
         .bool(IS_STREAM, "Is stream", element.isStream())
         .choice(
            DIRECTION,
            "Direction",
            ParameterDirectionKindUtils.asChoices(),
            element.getDirection().getLiteral())
         .choice(
            EFFECT,
            "Effect",
            ParameterEffectKindUtils.asChoices(),
            element.getEffect().getLiteral());

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final Parameter element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<Parameter> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case IS_EXCEPTION:
                  e.setIsException(Boolean.parseBoolean(value));
                  break;
               case IS_STREAM:
                  e.setIsStream(Boolean.parseBoolean(value));
                  break;
               case DIRECTION:
                  e.setDirection(ParameterDirectionKind.get(action.getValue()));
                  break;
               case EFFECT:
                  e.setEffect(ParameterEffectKind.get(action.getValue()));
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }

}

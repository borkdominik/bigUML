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
package com.borkdominik.big.glsp.uml.uml.elements.feature;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.BehavioralFeature;
import org.eclipse.uml2.uml.CallConcurrencyKind;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.model.NewListIndex;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.server.features.property_palette.utils.BGPropertyPaletteUtils;
import com.borkdominik.big.glsp.uml.uml.commands.UMLUpdateElementCommand;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.utils.ParameterPropertyPaletteUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class BehavioralFeaturePropertyProvider extends BGEMFElementPropertyProvider<BehavioralFeature> {

   public static final String IS_ABSTRACT = "isAbstract";
   public static final String CONCURRENCY = "concurrency";
   public static final String OWNED_PARAMETERS = "ownedParameters";
   public static final String OWNED_PARAMETERS_INDEX = "ownedParameters_index";

   protected Gson gson;

   @Inject
   public BehavioralFeaturePropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of(IS_ABSTRACT, CONCURRENCY, OWNED_PARAMETERS_INDEX));

      this.gson = new Gson();
   }

   @Override
   public List<ElementPropertyItem> doProvide(final BehavioralFeature element) {
      var elementId = providerContext.idGenerator().getOrCreateId(element);
      var builder = new ElementPropertyBuilder(elementId)
         .bool(IS_ABSTRACT, "Is Abstract", element.isStatic())
         .choice(
            CONCURRENCY,
            "Concurrency",
            CallConcurrencyKindUtils.asChoices(),
            element.getConcurrency().getLiteral())
         .reference(ParameterPropertyPaletteUtils.asReference(
            providerContext,
            elementId,
            OWNED_PARAMETERS, "Owned Parameters",
            element.getOwnedParameters()));

      return builder.items();
   }

   @Override
   public Command doHandle(final BGUpdateElementPropertyAction action, final BehavioralFeature element) {
      var value = action.getValue();
      var argument = UMLUpdateElementCommand.Argument
         .<BehavioralFeature> updateElementArgumentBuilder()
         .consumer(e -> {
            switch (action.getPropertyId()) {
               case IS_ABSTRACT:
                  e.setIsAbstract(Boolean.parseBoolean(value));
                  break;
               case CONCURRENCY:
                  e.setConcurrency(CallConcurrencyKind.get(value));
                  break;
               case OWNED_PARAMETERS_INDEX:
                  ArrayList<NewListIndex> values = gson.fromJson(action.getValue(),
                     new TypeToken<ArrayList<NewListIndex>>() {}.getType());

                  BGPropertyPaletteUtils.reorder(e.getOwnedParameters(), values);
                  break;
            }
         })
         .build();

      return new UMLUpdateElementCommand<>(context, modelState.getSemanticModel(), element, argument);
   }

}

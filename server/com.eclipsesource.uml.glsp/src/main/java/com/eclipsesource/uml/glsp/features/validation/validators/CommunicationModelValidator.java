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
package com.eclipsesource.uml.glsp.features.validation.validators;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.features.validation.Marker;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.google.inject.Inject;

public class CommunicationModelValidator implements ModelValidator {
   private static Logger LOGGER = Logger.getLogger(CommunicationModelValidator.class.getSimpleName());

   @Inject
   protected UmlModelState modelState;

   @Inject
   private ActionDispatcher actionDispatcher;

   @Inject
   @CommunicationValidator
   protected Validator<Interaction> interactionValidator;

   @Override
   public List<Marker> validate(final GModelElement... elements) {
      List<Marker> markers = new ArrayList<>();
      var modelIndex = modelState.getIndex();
      var semanticElements = Arrays.asList(elements).stream().map(element -> modelIndex.getSemantic(element))
         .filter(element -> element.isPresent()).map(element -> element.get()).collect(Collectors.toUnmodifiableList());

      semanticElements.forEach(element -> {
         if (element instanceof Interaction) {
            var validations = interactionValidator.validateWithChildren((Interaction) element);
            markers.addAll(ValidatorResultMapper.toMarkerList(validations));
         }
      });

      return markers;
   }

}

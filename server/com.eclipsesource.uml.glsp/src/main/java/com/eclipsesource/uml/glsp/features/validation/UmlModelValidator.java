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
package com.eclipsesource.uml.glsp.features.validation;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.validation.Marker;
import org.eclipse.glsp.server.features.validation.ModelValidator;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.validation.validators.CommunicationValidator;
import com.google.inject.Inject;

public class UmlModelValidator implements ModelValidator {
   private static Logger LOGGER = LogManager.getLogger(UmlModelValidator.class.getSimpleName());

   @Inject
   protected UmlModelState modelState;

   @Inject
   @CommunicationValidator
   protected ModelValidator communicationValidator;

   @Override
   public List<Marker> validate(final GModelElement... elements) {
      var diagramType = modelState.getUnsafeRepresentation();

      switch (diagramType) {
         case COMMUNICATION: {
            return communicationValidator.validate(elements);
         }
         default:
            LOGGER.debug("No modelValidator found for diagram type " + diagramType);
      }

      return List.of();
   }

}

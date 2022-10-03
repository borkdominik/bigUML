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

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.LabelEditValidator;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;

import com.eclipsesource.uml.glsp.features.validation.validators.CommunicationValidator;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.google.inject.Inject;

public class UmlLabelEditValidator implements LabelEditValidator {
   private static Logger LOGGER = LogManager.getLogger(UmlLabelEditValidator.class.getSimpleName());

   @Inject
   protected UmlModelState modelState;

   @Inject
   @CommunicationValidator
   protected LabelEditValidator communicationLabelEditValidator;

   @Override
   public ValidationStatus validate(final String label, final GModelElement element) {
      var diagramType = modelState.getUmlNotationModel().getRepresentation();

      switch (diagramType) {
         case COMMUNICATION: {
            return communicationLabelEditValidator.validate(label, element);
         }
         default:
            LOGGER.debug("No labelEditValidator found for diagram type " + diagramType);
      }

      return ValidationStatus.ok();
   }

}

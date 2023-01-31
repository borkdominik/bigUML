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

import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.LabelEditValidator;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Interaction;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Lifeline;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Message;
import com.google.inject.Inject;

public class CommunicationLabelEditValidator implements LabelEditValidator {
   private static Logger LOGGER = LogManager.getLogger(CommunicationLabelEditValidator.class.getSimpleName());
   private static Set<String> supportedElements = Set.of(UmlCommunication_Lifeline.TYPE_ID,
      UmlCommunication_Interaction.TYPE_ID, UmlCommunication_Message.TYPE_ID);

   @Inject
   protected UmlModelState modelState;

   @Inject
   @CommunicationValidator
   protected Validator<Interaction> interactionValidator;

   @Inject
   @CommunicationValidator
   protected Validator<Lifeline> lifelineValidator;

   @Inject
   @CommunicationValidator
   protected Validator<Message> messageValidator;

   @Override
   public ValidationStatus validate(final String label, final GModelElement element) {
      var container = findContainer(element);
      if (container == null) {
         return ValidationStatus.ok();
      }

      if (container.getType().equals(UmlCommunication_Interaction.TYPE_ID)) {
         return ValidatorResultMapper.toValidationResult(interactionValidator.validateName(element.getId(), label));
      } else if (container.getType().equals(UmlCommunication_Lifeline.TYPE_ID)) {
         return ValidatorResultMapper.toValidationResult(lifelineValidator.validateName(element.getId(), label));
      } else if (container.getType().equals(UmlCommunication_Message.TYPE_ID)) {
         return ValidatorResultMapper.toValidationResult(messageValidator.validateName(element.getId(), label));
      }

      return ValidationStatus.ok();
   }

   private GModelElement findContainer(final GModelElement element) {
      var iter = element;
      while (!supportedElements.contains(iter.getType()) && iter.eContainer() != null) {
         iter = (GModelElement) iter.eContainer();
      }

      if (supportedElements.contains(iter.getType())) {
         return iter;
      }

      return null;
   }

}

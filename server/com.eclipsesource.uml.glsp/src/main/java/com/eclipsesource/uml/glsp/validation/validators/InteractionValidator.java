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
package com.eclipsesource.uml.glsp.validation.validators;

import java.util.LinkedList;
import java.util.List;

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.google.inject.Inject;

public class InteractionValidator implements Validator<Interaction> {

   @Inject
   @CommunicationValidator
   private Validator<Lifeline> lifelineValidator;

   @Inject
   @CommunicationValidator
   private Validator<Message> messageValidator;

   @Override
   public ValidatorResult validateName(final String elementId, final String name) {
      if (name.isBlank()) {
         return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Empty interaction name",
            "The interaction needs a non empty name.");
      }

      return ValidatorResult.Success(elementId);
   }

   @Override
   public ValidatorResult validate(final Interaction element) {
      var elementId = EcoreUtil.getURI(element).fragment();

      return validateName(elementId, element.getName());

   }

   @Override
   public List<ValidatorResult> validateWithChildren(final Interaction element) {
      var results = new LinkedList<ValidatorResult>();

      results.add(validate(element));

      element.getLifelines().forEach(lifeline -> {
         results.addAll(lifelineValidator.validateWithChildren(lifeline));
      });

      element.getMessages().forEach(message -> {
         results.addAll(messageValidator.validateWithChildren(message));
      });

      return results;
   }
}

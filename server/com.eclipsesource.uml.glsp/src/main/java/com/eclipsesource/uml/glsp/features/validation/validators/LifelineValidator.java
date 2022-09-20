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

import java.util.List;
import java.util.regex.Pattern;

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Lifeline;

/*
 * Validates the name based on https://www.omg.org/spec/UML/2.5.1/About-UML/
 * lifeline-ident ::= ([ connectable-element-name [ '[' selector ']' ] ] [: class-name ] [decomposition] ) | 'self'
 * selector ::= expression
 * decomposition ::= ‘ref’ interaction-ident [ 'strict' ]
 */
public class LifelineValidator implements Validator<Lifeline> {
   private final Pattern lifelineNamePattern = Pattern
      .compile("^(([\\w\\s]+)(\\[[\\w\\s]+\\])?)?(:[\\w]+)?(\\s?ref [\\w]+( strict)?)?$|^self$");

   @Override
   public ValidatorResult validateName(final String elementId, final String name) {
      if (name.isBlank()) {
         return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Empty lifeline name",
            "The lifeline needs a non empty name.");
      } else if (!lifelineNamePattern.matcher(name).matches()) {
         return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Invalid lifeline name",
            "The lifeline has a invalid name. Check UML 2.5.1 specification. https://www.omg.org/spec/UML/2.5.1/About-UML/.");
      }

      return ValidatorResult.Success(elementId);
   }

   @Override
   public ValidatorResult validate(final Lifeline element) {
      var elementId = EcoreUtil.getURI(element).fragment();
      return validateName(elementId, element.getName());
   }

   @Override
   public List<ValidatorResult> validateWithChildren(final Lifeline element) {
      return List.of(validate(element));
   }
}

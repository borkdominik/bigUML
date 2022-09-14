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

import java.util.List;
import java.util.regex.Pattern;

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Message;

/*
 * Validates the name based on https://www.omg.org/spec/UML/2.5.1/About-UML/
 * sequence-expression ::= sequence-term '.' . . . ':' message-name
 * sequence-term ::= [ integer [ name ] ] [ recurrence ]
 * recurrence ::= branch | loop
 * branch ::= '[' guard ']'
 * loop ::= '*' [ '||' ] [ '['iteration-clause ']' ]
 */
public class MessageValidator implements Validator<Message> {
   private final Pattern messageSequenceTermPattern = Pattern.compile("^(\\d+[a-zA-Z]*(\\.\\d+[a-zA-Z]*)*\\s*).*");

   @Override
   public ValidatorResult validateName(final String elementId, final String name) {
      if (name.isBlank()) {
         return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Empty message name",
            "The message needs a non empty name.");
      }

      var sequenceTermMatcher = this.messageSequenceTermPattern.matcher(name);
      if (!sequenceTermMatcher.matches()) {
         return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Invalid message name",
            "The message has a invalid sequence-term name. Check UML 2.5.1 specification. https://www.omg.org/spec/UML/2.5.1/About-UML/.");
      }

      var restOfName = name.replaceFirst(sequenceTermMatcher.group(1), "");
      if (restOfName.isEmpty()) {
         return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Invalid message name",
            "The message has a invalid sequence-expression name. Check UML 2.5.1 specification. https://www.omg.org/spec/UML/2.5.1/About-UML/.");
      }

      switch (restOfName.charAt(0)) {
         case '[': {
            var endIndex = restOfName.lastIndexOf("]:");
            if (endIndex > 1 && endIndex < restOfName.length() - 2) {
               break;
            }
            return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Invalid message name",
               "The message has a invalid branch name. Check UML 2.5.1 specification. https://www.omg.org/spec/UML/2.5.1/About-UML/.");
         }
         case '*': {
            var endIndex = restOfName.lastIndexOf("]:");
            if (restOfName.startsWith("*[") && endIndex > 2 && endIndex < restOfName.length() - 2) {
               break;
            } else if (restOfName.startsWith("*||[") && endIndex > 4 && endIndex < restOfName.length() - 2) {
               break;
            } else if (restOfName.startsWith("*:") && restOfName.length() > 2) {
               break;
            }
            return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Invalid message name",
               "The message has a invalid loop name. Check UML 2.5.1 specification. https://www.omg.org/spec/UML/2.5.1/About-UML/.");
         }
         case ':': {
            if (restOfName.length() > 1) {
               break;
            }
            return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Invalid message name",
               "The message has a invalid message name. Check UML 2.5.1 specification. https://www.omg.org/spec/UML/2.5.1/About-UML/.");
         }
         default:
            return new ValidatorResult(ValidatorResult.Status.ERROR, elementId, "Invalid message name",
               "The message has a invalid name. Check UML 2.5.1 specification. https://www.omg.org/spec/UML/2.5.1/About-UML/.");
      }

      return ValidatorResult.Success(elementId);

   }

   @Override
   public ValidatorResult validate(final Message element) {
      var elementId = EcoreUtil.getURI(element).fragment();
      return validateName(elementId, element.getName());
   }

   @Override
   public List<ValidatorResult> validateWithChildren(final Message element) {
      return List.of(validate(element));
   }
}

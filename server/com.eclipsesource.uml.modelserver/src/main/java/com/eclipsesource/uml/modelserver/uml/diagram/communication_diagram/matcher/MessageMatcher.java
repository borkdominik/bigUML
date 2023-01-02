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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.matcher;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EObjectWithInverseEList;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

public final class MessageMatcher {

   public static Optional<Message> ofChildUsage(final Setting setting, final EObject interest) {
      var eObject = setting.getEObject();

      if (eObject instanceof Message) {
         var element = (Message) eObject;

         if (element.getInteraction().equals(interest)) {
            return Optional.of(element);
         }
      }

      return Optional.empty();
   }

   public static Optional<MessageOccurrenceSpecification> ofInverseMessageUsageSpecificationUsage(
      final Setting setting, final EObject interest) {
      var eObject = setting.getEObject();

      if (setting instanceof EObjectWithInverseEList && eObject instanceof MessageOccurrenceSpecification) {
         return Optional.of((MessageOccurrenceSpecification) eObject);
      }

      return Optional.empty();
   }
}

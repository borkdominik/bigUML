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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.MessageSort;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Message;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageSort;

public final class MessageTypeUtil {
   public static String toMessageSort(final UmlMessageSort type) {
      switch (type) {
         case REPLY:
            return UmlSequence_Message.Variant.replyTypeId();
         case ASYNC:
            return UmlSequence_Message.typeId();
         case SYNC:
            return UmlSequence_Message.Variant.syncTypeId();
         case CREATE:
            return UmlSequence_Message.Variant.createTypeId();
         default:
            throw new IllegalArgumentException();
      }
   }

   public static List<ElementChoicePropertyItem.Choice> asChoices() {
      return MessageSort.VALUES.stream()
         .map(v -> new ElementChoicePropertyItem.Choice.Builder(v.getLiteral(), v.getLiteral()).build())
         .collect(Collectors.toList());
   }
}

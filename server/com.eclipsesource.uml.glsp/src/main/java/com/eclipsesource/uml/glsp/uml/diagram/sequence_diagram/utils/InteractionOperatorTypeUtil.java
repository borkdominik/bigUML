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

import org.eclipse.uml2.uml.InteractionOperatorKind;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.InteractionOperatorType;

public final class InteractionOperatorTypeUtil {
   public static String toInteractionOperatorType(final InteractionOperatorType type) {
      switch (type) {
         case ALT:
            return InteractionOperatorKind.ALT_LITERAL.getLiteral();
         case OPT:
            return InteractionOperatorKind.OPT_LITERAL.getLiteral();
         case LOOP:
            return InteractionOperatorKind.LOOP_LITERAL.getLiteral();
         case BREAK:
            return InteractionOperatorKind.BREAK_LITERAL.getLiteral();
         case SEQ:
            return InteractionOperatorKind.SEQ_LITERAL.getLiteral();
         case STRICT:
            return InteractionOperatorKind.STRICT_LITERAL.getLiteral();
         case PAR:
            return InteractionOperatorKind.PAR_LITERAL.getLiteral();
         case CRITICAL:
            return InteractionOperatorKind.CRITICAL_LITERAL.getLiteral();
         case IGNORE:
            return InteractionOperatorKind.IGNORE_LITERAL.getLiteral();
         case CONSIDER:
            return InteractionOperatorKind.CONSIDER_LITERAL.getLiteral();
         case ASSERT:
            return InteractionOperatorKind.ASSERT_LITERAL.getLiteral();
         case NEG:
            return InteractionOperatorKind.NEG_LITERAL.getLiteral();
         default:
            throw new IllegalArgumentException();
      }
   }

   public static List<ElementChoicePropertyItem.Choice> asChoices() {
      return InteractionOperatorKind.VALUES.stream()
         .map(v -> new ElementChoicePropertyItem.Choice.Builder(v.getLiteral(), v.getLiteral()).build())
         .collect(Collectors.toList());
   }
}

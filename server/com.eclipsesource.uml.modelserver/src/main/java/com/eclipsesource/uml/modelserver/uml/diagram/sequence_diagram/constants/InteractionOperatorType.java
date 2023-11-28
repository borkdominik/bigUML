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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants;

import org.eclipse.uml2.uml.InteractionOperatorKind;

public enum InteractionOperatorType {
   ALT,
   OPT,
   LOOP,
   BREAK,
   SEQ,
   STRICT,
   PAR,
   CRITICAL,
   IGNORE,
   CONSIDER,
   ASSERT,
   NEG;

   public InteractionOperatorKind toOperatorKind() {
      switch (this) {
         case ALT:
            return InteractionOperatorKind.ALT_LITERAL;
         case OPT:
            return InteractionOperatorKind.OPT_LITERAL;
         case LOOP:
            return InteractionOperatorKind.LOOP_LITERAL;
         case BREAK:
            return InteractionOperatorKind.BREAK_LITERAL;
         case SEQ:
            return InteractionOperatorKind.SEQ_LITERAL;
         case STRICT:
            return InteractionOperatorKind.STRICT_LITERAL;
         case PAR:
            return InteractionOperatorKind.PAR_LITERAL;
         case CRITICAL:
            return InteractionOperatorKind.CRITICAL_LITERAL;
         case IGNORE:
            return InteractionOperatorKind.IGNORE_LITERAL;
         case CONSIDER:
            return InteractionOperatorKind.CONSIDER_LITERAL;
         case ASSERT:
            return InteractionOperatorKind.ASSERT_LITERAL;
         case NEG:
            return InteractionOperatorKind.NEG_LITERAL;

         default:
            throw new IllegalArgumentException();
      }
   }
}

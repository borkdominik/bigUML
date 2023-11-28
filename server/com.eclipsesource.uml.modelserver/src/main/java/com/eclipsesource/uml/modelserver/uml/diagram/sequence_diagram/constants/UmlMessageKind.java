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

import org.eclipse.uml2.uml.MessageKind;

public enum UmlMessageKind {
   COMPLETE,
   FOUND,
   LOST;

   public MessageKind toMessageSort() {
      switch (this) {
         case FOUND:
            return MessageKind.FOUND_LITERAL;
         case LOST:
            return MessageKind.LOST_LITERAL;
         case COMPLETE:
            return MessageKind.COMPLETE_LITERAL;
         default:
            throw new IllegalArgumentException();
      }
   }
}

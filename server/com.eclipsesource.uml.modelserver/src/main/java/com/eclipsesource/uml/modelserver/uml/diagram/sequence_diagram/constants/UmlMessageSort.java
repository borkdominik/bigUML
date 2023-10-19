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

import org.eclipse.uml2.uml.MessageSort;

public enum UmlMessageSort {
   ASYNCH_CALL_LITERAL,
   ASYNCH_SIGNAL_LITERAL,
   CREATE,
   DELETE,
   ASYNC,
   REPLY,
   SYNC;

   public MessageSort toMessageSort() {
      switch (this) {
         case ASYNC:
            return MessageSort.ASYNCH_CALL_LITERAL;
         case ASYNCH_CALL_LITERAL:
            return MessageSort.ASYNCH_CALL_LITERAL;
         case ASYNCH_SIGNAL_LITERAL:
            return MessageSort.ASYNCH_SIGNAL_LITERAL;
         case CREATE:
            return MessageSort.CREATE_MESSAGE_LITERAL;
         case DELETE:
            return MessageSort.DELETE_MESSAGE_LITERAL;
         case REPLY:
            return MessageSort.REPLY_LITERAL;
         case SYNC:
            return MessageSort.SYNCH_CALL_LITERAL;

         default:
            throw new IllegalArgumentException();
      }
   }
}

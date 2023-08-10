/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.handler.operation.update;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.glsp.server.operations.Operation;

public class UpdateOperation extends Operation {

   public static final String KIND = "updateOperation";
   private String elementId;

   private Map<String, String> context;
   private Map<String, Object> args;

   public UpdateOperation() {
      this(null);
   }

   public UpdateOperation(final String elementId) {
      this(elementId, new HashMap<>(), new HashMap<>());
   }

   public UpdateOperation(final String elementId, final Map<String, String> context,
      final Map<String, Object> args) {
      super(KIND);
      this.elementId = elementId;
      this.context = context;
      this.args = args;
   }

   public String getElementId() { return elementId; }

   public void setElementId(final String elementId) { this.elementId = elementId; }

   public Map<String, Object> getArgs() { return args; }

   public void setArgs(final Map<String, Object> args) { this.args = args; }

   public Map<String, String> getContext() { return context; }

   public void setContext(final Map<String, String> context) { this.context = context; }
}

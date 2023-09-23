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
package com.eclipsesource.uml.glsp.core.handler.operation.delete;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.operations.DeleteOperation;

public class UmlDeleteOperation extends DeleteOperation {

   protected Map<String, Object> args = new HashMap<>();

   public UmlDeleteOperation() {
      this(new ArrayList<>());
   }

   public UmlDeleteOperation(final List<String> elementIds) {
      super(elementIds);
   }

   public UmlDeleteOperation(final List<String> elementIds, final Map<String, Object> args) {
      super(elementIds);
      this.args = args;
   }

   public Map<String, Object> getArgs() { return args; }

   public void setArgs(final Map<String, Object> args) { this.args = args; }

}

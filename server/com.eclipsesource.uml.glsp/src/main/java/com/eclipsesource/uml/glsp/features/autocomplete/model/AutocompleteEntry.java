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
package com.eclipsesource.uml.glsp.features.autocomplete.model;

import org.eclipse.uml2.uml.Action;

public class AutocompleteEntry {
   protected String label;
   protected String hint;
   protected Action action;

   public AutocompleteEntry(final String label, final Action action) {
      super();
      this.label = label;
      this.action = action;
   }

   public AutocompleteEntry(final String label, final String hint, final Action action) {
      super();
      this.label = label;
      this.hint = hint;
      this.action = action;
   }

   public String getLabel() { return label; }

   public void setLabel(final String label) { this.label = label; }

   public String getHint() { return hint; }

   public void setHint(final String hint) { this.hint = hint; }

   public Action getAction() { return action; }

   public void setAction(final Action action) { this.action = action; }

}

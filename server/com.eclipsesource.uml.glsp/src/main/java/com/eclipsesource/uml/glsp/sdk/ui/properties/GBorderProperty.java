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
package com.eclipsesource.uml.glsp.sdk.ui.properties;

import org.eclipse.glsp.graph.GModelElement;

public class GBorderProperty implements GModelProperty {

   public final String BORDER_ARG = "border";

   protected final Boolean value;

   public GBorderProperty() {
      this(true);
   }

   public GBorderProperty(final Boolean value) {
      super();
      this.value = value;
   }

   @Override
   public void assign(final GModelElement element) {
      element.getArgs().put(BORDER_ARG, value);
   }

}

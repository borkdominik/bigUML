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
package com.eclipsesource.uml.glsp.uml.gmodel.builder;

import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;

public class UmlGLayoutOptions extends GLayoutOptions {

   public UmlGLayoutOptions hGrab(final boolean grab) {
      this.put("hGrab", grab);

      return this;
   }

   public UmlGLayoutOptions vGrab(final boolean grab) {
      this.put("vGrab", grab);

      return this;
   }

   public UmlGLayoutOptions defaultPadding() {
      this.putAll(new GLayoutOptions()
         .paddingTop(5.0)
         .paddingRight(10.0)
         .paddingBottom(5.0)
         .paddingLeft(10.0)
         .paddingFactor(1.0));

      return this;
   }

   public UmlGLayoutOptions padding(final Double padding) {
      this.putAll(new GLayoutOptions()
         .paddingTop(padding)
         .paddingRight(padding)
         .paddingBottom(padding)
         .paddingLeft(padding)
         .paddingFactor(1.0));

      return this;
   }

   public UmlGLayoutOptions paddingHorizontal(final Double padding) {
      this.putAll(new GLayoutOptions()
         .paddingRight(padding)
         .paddingLeft(padding)
         .paddingFactor(1.0));

      return this;
   }

   public UmlGLayoutOptions paddingVertical(final Double padding) {
      this.putAll(new GLayoutOptions()
         .paddingTop(padding)
         .paddingBottom(padding)
         .paddingFactor(1.0));

      return this;
   }

   public UmlGLayoutOptions clearPadding() {
      this.putAll(new GLayoutOptions()
         .paddingTop(0.0)
         .paddingRight(0.0)
         .paddingBottom(0.0)
         .paddingLeft(0.0));

      return this;
   }
}

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
package com.eclipsesource.uml.glsp.sdk.ui.components.label;

import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;

public class GCNameLabel
   extends GCLabel {
   public static final String CSS_ID = "gc-name-label";

   public GCNameLabel(final GModelContext context, final EObject origin, final Options options) {
      super(context, origin, options);
      init();
   }

   protected void init() {
      options.id = Optional
         .of(context.suffix().appendTo(NameLabelSuffix.SUFFIX, context.idGenerator().getOrCreateId(origin)));
      options.type = CoreTypes.LABEL_NAME;
   }

   @Override
   public Options getOptions() { return (Options) options; }

   @Override
   public String getIdentifier() { return CSS_ID; }

   public static class Options extends GCLabel.Options {
      public Options(final String label) {
         super(label);

         css.addAll(List.of(CoreCSS.FONT_BOLD, CoreCSS.TEXT_HIGHLIGHT));
      }

   }

}

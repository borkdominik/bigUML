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
package com.eclipsesource.uml.glsp.sdk.ui.components.header;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCIdentifiable;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;

public class GCHeader extends GCModelList<EObject, GModelElement> implements GCIdentifiable {
   public static final String CSS_ID = "gc-header";
   protected final Boolean fullHeight;

   public GCHeader(final GModelContext context, final EObject source) {
      this(context, source, new Options());
   }

   public GCHeader(final GModelContext context, final EObject source, final Options options) {
      super(context, source);
      this.fullHeight = options.fullHeight;
   }

   @Override
   public String getIdentifier() { return CSS_ID; }

   @Override
   protected Optional<GModelElement> createRootGModel() {
      if (!this.fullHeight) {
         return Optional.of(new UmlGCompartmentBuilder<>(origin, context)
            .type(DefaultTypes.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.VBOX)
            .layoutOptions(new UmlGLayoutOptions()
               .padding(UmlPaddingValues.LEVEL_1, UmlPaddingValues.LEVEL_2)
               .hGrab(true)
               .hAlign(GConstants.HAlign.CENTER))
            .build());
      }

      return Optional.of(new UmlGCompartmentBuilder<>(origin, context)
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new UmlGLayoutOptions()
            .padding(UmlPaddingValues.LEVEL_1, UmlPaddingValues.LEVEL_2)
            .hGrab(true)
            .vGrab(true)
            .vAlign(GConstants.VAlign.CENTER))
         .build());
   }

   @Override
   protected Optional<GModelElement> createChildrenGModel() {
      if (!fullHeight) {
         return Optional.empty();
      }

      return Optional.of(new UmlGCompartmentBuilder<>(origin, context)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new UmlGLayoutOptions()
            .hGrab(true)
            .hAlign(GConstants.HAlign.CENTER))
         .build());
   }

   public static class Options {
      public boolean fullHeight = false;
   }
}

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

import java.util.LinkedHashMap;
import java.util.Map;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.builder.AbstractGCompartmentBuilder;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.core.constants.UmlLayoutConstants;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;

@Deprecated
public class UmlGCompartmentBuilder<TProvider extends GIdGeneratorProvider & GIdContextGeneratorProvider, TBuilder extends UmlGCompartmentBuilder<TProvider, TBuilder>>
   extends AbstractGCompartmentBuilder<GCompartment, TBuilder> {
   protected EObject source;
   protected TProvider provider;

   public UmlGCompartmentBuilder(final EObject source, final TProvider provider) {
      this(source, provider, DefaultTypes.COMPARTMENT);
   }

   public UmlGCompartmentBuilder(final EObject source, final TProvider provider, final String type) {
      super(type);

      this.source = source;
      this.provider = provider;

      this.prepareProperties();
   }

   protected void prepareProperties() {
      this.id(provider.idContextGenerator().getOrCreateId(source));
   }

   public TBuilder withHeaderLayout() {
      this.type(DefaultTypes.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new UmlGLayoutOptions()
            .padding(UmlPaddingValues.LEVEL_1, UmlPaddingValues.LEVEL_2)
            .hGrab(true)
            .hAlign(GConstants.HAlign.CENTER));

      return self();
   }

   public TBuilder withVBoxLayout() {
      this.type(DefaultTypes.COMPARTMENT)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new UmlGLayoutOptions()
            .clearPadding()
            .hGrab(true)
            .hAlign(GConstants.HAlign.LEFT));

      return self();
   }

   public TBuilder withHBoxLayout() {
      this.type(DefaultTypes.COMPARTMENT)
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new UmlGLayoutOptions()
            .clearPadding()
            .hAlign(GConstants.HAlign.LEFT));

      return self();
   }

   public TBuilder withFreeformLayout() {
      this.type(DefaultTypes.COMPARTMENT)
         .addArgument("divider", true)
         .layout(UmlLayoutConstants.FREEFORM)
         .layoutOptions(new UmlGLayoutOptions()
            .clearPadding()
            .hAlign(GConstants.HAlign.LEFT));

      return self();
   }

   public TBuilder addLayoutOptions(final Map<String, Object> layoutOptions) {
      if (this.layoutOptions == null) {
         this.layoutOptions = new LinkedHashMap<>();
      }
      this.layoutOptions.putAll(layoutOptions);
      return self();
   }

   @Override
   protected GCompartment instantiate() {
      return GraphFactory.eINSTANCE.createGCompartment();
   }

   @Override
   protected TBuilder self() {
      return (TBuilder) this;
   }
}

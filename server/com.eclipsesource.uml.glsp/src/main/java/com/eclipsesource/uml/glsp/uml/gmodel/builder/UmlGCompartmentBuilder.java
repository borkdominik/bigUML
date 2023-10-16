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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.builder.AbstractGCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.core.constants.UmlLayoutConstants;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;

public class UmlGCompartmentBuilder<TProvider extends GIdGeneratorProvider & GIdContextGeneratorProvider>
   extends AbstractGCompartmentBuilder<GCompartment, UmlGCompartmentBuilder<?>> {
   protected EObject source;
   protected TProvider provider;

   public UmlGCompartmentBuilder(final EObject source, final TProvider provider) {
      this(source, provider, DefaultTypes.COMPARTMENT);
   }

   public UmlGCompartmentBuilder(final EObject source, final TProvider provider, final String type) {
      super(type);

      this.source = source;
      this.provider = provider;

      this.prepare();
   }

   protected void prepare() {
      this.id(provider.idContextGenerator().getOrCreateId(source));
   }

   public UmlGCompartmentBuilder<?> withHeaderLayout() {
      this.type(DefaultTypes.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new GLayoutOptions().hAlign(GConstants.HAlign.CENTER));
      return self();
   }

   public UmlGCompartmentBuilder<?> withFixedChildrenLayout() {
      var options = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      options.put("hGrab", true);

      this.type(DefaultTypes.COMPARTMENT)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(options);

      return self();
   }

   public UmlGCompartmentBuilder<?> asFreeformChildren() {
      this.type(DefaultTypes.COMPARTMENT)
         .addArgument("divider", true)
         .layout(UmlLayoutConstants.FREEFORM)
         .layoutOptions(new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true));

      return self();
   }

   @Override
   protected GCompartment instantiate() {
      return GraphFactory.eINSTANCE.createGCompartment();
   }

   @Override
   protected UmlGCompartmentBuilder<?> self() {
      return this;
   }
}

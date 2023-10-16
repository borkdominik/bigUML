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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.classifier.GClassifierBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GClassBuilder<TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider>
   extends GClassifierBuilder<Class, TProvider, GClassBuilder<?>> {

   public GClassBuilder(final Class source, final TProvider provider, final String type) {
      super(source, provider, type);

      prepare();
   }

   protected void prepare() {
      var options = new GLayoutOptions();

      this.id(provider.idGenerator().getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(options)
         .addCssClass(CoreCSS.NODE);

      useHeader();
      useBody();
   }

   protected void useHeader() {
      var header = new UmlGCompartmentBuilder<>(source, provider)
         .withHeaderLayout();

      if (source.isAbstract()) {
         header.add(buildName(source, List.of(CoreCSS.FONT_BOLD, CoreCSS.FONT_ITALIC)));
      } else {
         header.add(buildName(source, List.of(CoreCSS.FONT_BOLD)));
      }

      add(header.build());
   }

   protected void useBody() {
      var compartment = new UmlGCompartmentBuilder<>(source, provider)
         .withFixedChildrenLayout();

      compartment
         .addAll(listAttributes())
         .addAll(listOperations());

      add(compartment.build());
   }

}

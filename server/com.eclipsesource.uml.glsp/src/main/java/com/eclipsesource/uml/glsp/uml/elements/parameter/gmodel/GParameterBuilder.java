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
package com.eclipsesource.uml.glsp.uml.elements.parameter.gmodel;

import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.eclipsesource.uml.glsp.uml.elements.named_element.GNamedElementBuilder;
import com.eclipsesource.uml.glsp.uml.elements.parameter.utils.ParameterPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;

public class GParameterBuilder<TSource extends Parameter, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GParameterBuilder<TSource, TProvider, TBuilder>>
   extends GNamedElementBuilder<TSource, TProvider, TBuilder> {

   public GParameterBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareProperties() {
      super.prepareProperties();
      border(false);
   }

   @Override
   protected void prepareLayout() {
      this.layout(GConstants.Layout.HBOX)
         .layoutOptions(prepareLayoutOptions());
   }

   @Override
   protected GLayoutOptions prepareLayoutOptions() {
      return new UmlGLayoutOptions()
         .clearPadding()
         .hGap(3);
   }

   @Override
   protected boolean hasChildren() {
      return false;
   }

   @Override
   protected Optional<List<GModelElement>> initializeHeaderElements() {
      return Optional.of(List.of(asLabel(source)));
   }

   @Override
   protected void showHeader(final Optional<List<GModelElement>> headerElements) {
      headerElements.ifPresent(elements -> {
         var header = new UmlGCompartmentBuilder<>(source, provider)
            .withHBoxLayout();

         header.addAll(elements);

         add(header.build());
      });
   }

   protected GModelElement asLabel(final TSource source) {
      if (source.getDirection() == ParameterDirectionKind.RETURN_LITERAL) {
         return asReturnParameter(source);
      }

      return asParameter(source);
   }

   protected GModelElement asParameter(final TSource source) {
      return new UmlGLabelBuilder<>(source, provider)
         .text(ParameterPropertyPaletteUtils.asText(source))
         .build();
   }

   protected GModelElement asReturnParameter(final TSource source) {
      return new UmlGLabelBuilder<>(source, provider)
         .text(String.format("%s", TypeUtils.asText(source.getType(), source))).build();
   }
}

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
package com.eclipsesource.uml.glsp.uml.elements.enumeration.gmodel;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.elements.data_type.gmodel.GDataTypeBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGDividerBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlGapValues;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GEnumerationBuilder<TSource extends Enumeration, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GEnumerationBuilder<TSource, TProvider, TBuilder>>
   extends GDataTypeBuilder<TSource, TProvider, TBuilder> {

   public GEnumerationBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareRepresentation() {
      showHeader(this.headerElements);
      showEnumerationLiterals(this.source);
   }

   @Override
   protected Optional<List<GModelElement>> initializeHeaderElements() {
      return Optional.of(List.of(
         new UmlGLabelBuilder<>(source, provider)
            .text(QuotationMark.quoteDoubleAngle("enumeration"))
            .addCssClasses(List.of(CoreCSS.FONT_BOLD))
            .build(),
         buildName(source, List.of(CoreCSS.FONT_BOLD))));
   }

   protected void showEnumerationLiterals(final TSource source) {
      var root = new UmlGCompartmentBuilder<>(source, provider)
         .withVBoxLayout();

      root.add(
         new UmlGDividerBuilder<>(source, provider).build());

      var elements = new UmlGCompartmentBuilder<>(source, provider)
         .withVBoxLayout()
         .addLayoutOptions(new UmlGLayoutOptions()
            .paddingVertical(UmlPaddingValues.LEVEL_1)
            .paddingHorizontal(UmlPaddingValues.LEVEL_2)
            .vGap(UmlGapValues.LEVEL_1));

      elements.addAll(source.getOwnedLiterals().stream()
         .map(e -> provider.gmodelMapHandler().handle(e))
         .collect(Collectors.toList()));

      root.add(elements.build());
      add(root.build());
   }
}

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
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.elements.data_type.gmodel.GDataTypeBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGDividerBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
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
   protected void prepareAdditionals() {
      border(true);
      showHeader();
      showEnumerationLiterals();
   }

   @Override
   protected void showHeader() {
      var header = new UmlGCompartmentBuilder<>(source, provider)
         .withHeaderLayout();

      header.add(new UmlGLabelBuilder<>(source, provider)
         .text(QuotationMark.quoteDoubleAngle("enumeration"))
         .addCssClasses(List.of(CoreCSS.FONT_BOLD))
         .build());
      header.add(buildName(source, List.of(CoreCSS.FONT_BOLD)));

      add(header.build());
   }

   protected void showEnumerationLiterals() {
      var compartment = new UmlGCompartmentBuilder<>(source, provider)
         .withVBoxLayout();
      compartment.add(new UmlGDividerBuilder<>(source, provider).build());

      var literalElements = source.getOwnedLiterals().stream()
         .map(e -> provider.gmodelMapHandler().handle(e))
         .collect(Collectors.toList());
      compartment.addAll(literalElements);

      add(compartment.build());
   }
}

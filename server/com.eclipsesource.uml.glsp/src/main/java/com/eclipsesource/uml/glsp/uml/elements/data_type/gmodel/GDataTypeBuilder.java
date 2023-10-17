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
package com.eclipsesource.uml.glsp.uml.elements.data_type.gmodel;

import java.util.List;

import org.eclipse.uml2.uml.DataType;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.elements.classifier.GClassifierBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GDataTypeBuilder<TSource extends DataType, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GDataTypeBuilder<TSource, TProvider, TBuilder>>
   extends GClassifierBuilder<TSource, TProvider, TBuilder> {

   public GDataTypeBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareAdditionals() {
      super.prepareAdditionals();

      showHeader();
      showAttributesAndOperations();
   }

   protected void showHeader() {
      var header = new UmlGCompartmentBuilder<>(source, provider)
         .withHeaderLayout();

      header.add(new UmlGLabelBuilder<>(source, provider)
         .text(QuotationMark.quoteDoubleAngle("dataType"))
         .addCssClasses(List.of(CoreCSS.FONT_BOLD))
         .build());
      header.add(buildName(source, List.of(CoreCSS.FONT_BOLD)));

      add(header.build());
   }

}

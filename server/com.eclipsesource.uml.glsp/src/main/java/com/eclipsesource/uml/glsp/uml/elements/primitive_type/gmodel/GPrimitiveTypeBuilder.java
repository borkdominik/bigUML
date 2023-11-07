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
package com.eclipsesource.uml.glsp.uml.elements.primitive_type.gmodel;

import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.elements.data_type.gmodel.GDataTypeBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GPrimitiveTypeBuilder<TSource extends PrimitiveType, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GPrimitiveTypeBuilder<TSource, TProvider, TBuilder>>
   extends GDataTypeBuilder<TSource, TProvider, TBuilder> {

   public GPrimitiveTypeBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected Optional<List<GModelElement>> initializeHeaderElements() {
      return Optional.of(List.of(new UmlGLabelBuilder<>(source, provider)
         .text(QuotationMark.quoteDoubleAngle("primitive"))
         .addCssClasses(List.of(CoreCSS.FONT_BOLD))
         .build(),
         buildName(source, List.of(CoreCSS.FONT_BOLD))));
   }

}

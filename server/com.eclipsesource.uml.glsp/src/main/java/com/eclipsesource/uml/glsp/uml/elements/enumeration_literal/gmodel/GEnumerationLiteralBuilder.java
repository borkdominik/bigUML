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
package com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.gmodel;

import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.instance_specification.gmodel.GInstanceSpecificationBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GEnumerationLiteralBuilder<TSource extends EnumerationLiteral, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GEnumerationLiteralBuilder<TSource, TProvider, TBuilder>>
   extends GInstanceSpecificationBuilder<TSource, TProvider, TBuilder> {

   public GEnumerationLiteralBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareProperties() {
      super.prepareProperties();
      border(false);
      selectionBorder(true);
   }

   @Override
   protected void prepareLayout() {
      this.layout(GConstants.Layout.HBOX)
         .layoutOptions(prepareLayoutOptions())
         .addCssClass(CoreCSS.NODE);
   }

   @Override
   protected GLayoutOptions prepareLayoutOptions() {
      return new UmlGLayoutOptions()
         .clearPadding();
   }

   @Override
   protected void showHeader(final Optional<List<GModelElement>> headerElements) {
      headerElements.ifPresent(elements -> {
         addAll(elements);
      });
   }

   @Override
   protected Optional<List<GModelElement>> initializeHeaderElements() {
      return Optional.of(List.of(buildName(source, List.of())));
   }
}

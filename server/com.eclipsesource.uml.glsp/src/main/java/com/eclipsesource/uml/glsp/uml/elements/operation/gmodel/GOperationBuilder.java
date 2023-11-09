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
package com.eclipsesource.uml.glsp.uml.elements.operation.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GNamedElementBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GOperationBuilder<TSource extends Operation, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GOperationBuilder<TSource, TProvider, TBuilder>>
   extends GNamedElementBuilder<TSource, TProvider, TBuilder> {

   public GOperationBuilder(final TSource source, final TProvider provider, final String type) {
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
         .layoutOptions(prepareLayoutOptions());
   }

   @Override
   protected GLayoutOptions prepareLayoutOptions() {
      return new UmlGLayoutOptions()
         .clearPadding()
         .hGap(3);
   }

   @Override
   protected void prepareRepresentation() {
      super.prepareRepresentation();
      showParameters(source);
      showReturns(source);
   }

   @Override
   protected boolean hasChildren() {
      return false;
   }

   @Override
   protected Optional<List<GModelElement>> initializeHeaderElements() {
      var textCss = new ArrayList<String>();

      if (source.isStatic()) {
         textCss.add(CoreCSS.TEXT_UNDERLINE);
      }

      if (source.isAbstract()) {
         textCss.add(CoreCSS.FONT_ITALIC);
      }

      return Optional.of(List.of(
         buildVisibility(source, List.of()),
         buildName(source, textCss)));
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

   protected void showParameters(final TSource source) {
      var root = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout();

      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() != ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      root.add(new UmlGLabelBuilder<>(source, provider).text("(").build());

      for (int i = 0; i < parameters.size(); i++) {
         if (i > 0) {
            root.add(new UmlGLabelBuilder<>(source, provider).text(",").build());
         }

         root.add(provider.gmodelMapHandler().handle(parameters.get(i)));
      }

      root.add(new UmlGLabelBuilder<>(source, provider).text(")").build());

      add(root.build());
   }

   protected void showReturns(final TSource source) {
      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() == ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      if (parameters.size() > 0) {
         add(new UmlGLabelBuilder<>(source, provider).text(":").build());

         for (int i = 0; i < parameters.size(); i++) {
            if (i > 0) {
               add(new UmlGLabelBuilder<>(source, provider).text(",").build());
            }

            add(provider.gmodelMapHandler().handle(parameters.get(i)));
         }
      }
   }
}

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

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Operation;
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

public class GOperationBuilder<TSource extends Operation, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GOperationBuilder<TSource, TProvider, TBuilder>>
   extends GNamedElementBuilder<TSource, TProvider, TBuilder> {

   public GOperationBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareLayout() {
      this.layout(GConstants.Layout.HBOX)
         .layoutOptions(new UmlGLayoutOptions()
            .clearPadding()
            .hGap(3)
            .resizeContainer(true));
   }

   @Override
   protected void prepareAdditionals() {
      showHeader();
      showParameters();
      showReturns();
   }

   protected void showHeader() {
      var header = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout();

      header.add(buildVisibility(source, List.of()));
      header.add(buildName(source, List.of()));

      add(header.build());
   }

   protected void showParameters() {
      var builder = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout();

      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() != ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      builder.add(new UmlGLabelBuilder<>(source, provider).text("(").build());

      for (int i = 0; i < parameters.size(); i++) {
         if (i > 0) {
            builder.add(new UmlGLabelBuilder<>(source, provider).text(",").build());
         }

         var parameterBuilder = new UmlGCompartmentBuilder<>(source, provider)
            .withHBoxLayout()
            .add(new UmlGLabelBuilder<>(source, provider)
               .text(ParameterPropertyPaletteUtils.asText(parameters.get(i)))
               .build());
         builder.add(parameterBuilder.build());
      }

      builder.add(new UmlGLabelBuilder<>(source, provider).text(")").build());

      add(builder.build());
   }

   protected void showReturns() {
      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() == ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      if (parameters.size() > 0) {
         add(new UmlGLabelBuilder<>(source, provider).text(":").build());

         for (int i = 0; i < parameters.size(); i++) {
            if (i > 0) {
               add(new UmlGLabelBuilder<>(source, provider).text(",").build());
            }

            add(new UmlGLabelBuilder<>(source, provider)
               .text(String.format("%s", TypeUtils.name(parameters.get(i).getType()))).build());
         }
      }
   }

}

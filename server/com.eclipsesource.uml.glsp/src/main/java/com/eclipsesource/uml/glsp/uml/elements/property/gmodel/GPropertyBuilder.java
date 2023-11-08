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
package com.eclipsesource.uml.glsp.uml.elements.property.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.features.autocomplete.constants.AutocompleteConstants;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GNamedElementBuilder;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;

public class GPropertyBuilder<TSource extends Property, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider & ElementConfigurationAccessor, TBuilder extends GPropertyBuilder<TSource, TProvider, TBuilder>>
   extends GNamedElementBuilder<TSource, TProvider, TBuilder> {

   public GPropertyBuilder(final TSource source, final TProvider provider, final String type) {
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
      var elements = new ArrayList<GModelElement>();
      elements.addAll(leftSide(source));
      elements.addAll(rightSide(source));

      return Optional.of(elements);
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

   protected List<GModelElement> leftSide(final TSource source) {
      var root = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout()
         .addLayoutOptions(new GLayoutOptions().hGap(3));

      root.add(buildVisibility(source, List.of()));

      if (source.isDerived()) {
         root.add(new UmlGLabelBuilder<>(source, provider).text("/").build());
      }

      var textCss = new ArrayList<String>();

      if (source.isStatic()) {
         textCss.add(CoreCSS.TEXT_UNDERLINE);
      }

      root.add(buildName(source, textCss));

      return List.of(root.build());
   }

   protected List<GModelElement> rightSide(final TSource source) {
      var root = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout()
         .addLayoutOptions(new GLayoutOptions().hGap(3));

      var applied = new ArrayList<GModelElement>();
      applied.add(buildType());
      applied.add(buildMultiplicity());

      if (applied.stream().anyMatch(a -> a != null)) {
         var detailsBuilder = new UmlGCompartmentBuilder<>(source, provider)
            .withHBoxLayout()
            .addLayoutOptions(new GLayoutOptions().hGap(3));

         applied.forEach(a -> {
            if (a != null) {
               detailsBuilder.add(a);
            }
         });
         root
            .add(new UmlGLabelBuilder<>(source, provider).text(":").build())
            .add(detailsBuilder.build());

         return List.of(root.build());
      }

      return List.of();
   }

   protected GModelElement buildType() {
      return Optional.ofNullable(source.getType()).map(type -> {
         var name = type.getName() == null || type.getName().isBlank()
            ? type.getClass().getSimpleName().replace("Impl", "")
            : type.getName();
         return buildTypeName(name);
      }).orElse(null);
   }

   protected GLabel buildTypeName(final String text) {
      return new UmlGLabelBuilder<>(source, provider, provider.configuration(PropertyConfiguration.class).typeTypeId())
         .id(provider.suffix().appendTo(PropertyTypeLabelSuffix.SUFFIX, provider.idGenerator().getOrCreateId(source)))
         .text(text)
         .addArgument(AutocompleteConstants.GMODEL_FEATURE, true)
         .build();
   }

   protected GModelElement buildMultiplicity() {
      var multiplicity = MultiplicityUtil.getMultiplicity(source);

      if (!multiplicity.equals("1")) {
         var builder = new UmlGCompartmentBuilder<>(source, provider)
            .withHBoxLayout()
            .addLayoutOptions(new GLayoutOptions().hGap(3));

         builder
            .add(new UmlGLabelBuilder<>(source, provider).text("[").build())
            .add(new UmlGLabelBuilder<>(source, provider,
               provider.configuration(PropertyConfiguration.class).multiplicityTypeId())
                  .id(provider.suffix().appendTo(PropertyMultiplicityLabelSuffix.SUFFIX,
                     provider.idGenerator().getOrCreateId(source)))
                  .text(multiplicity)
                  .build())
            .add(new UmlGLabelBuilder<>(source, provider).text("]").build());

         return builder.build();
      }

      return null;
   }
}

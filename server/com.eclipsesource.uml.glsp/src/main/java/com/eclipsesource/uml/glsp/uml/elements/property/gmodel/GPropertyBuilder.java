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
   protected void prepareLayout() {
      this.layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true));
   }

   @Override
   protected void prepareAdditionals() {
      leftSide();
      rightSide();
      applyIsStatic();
   }

   protected void showHeader() {
      var header = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout()
         .clearPadding();

      header.add(buildVisibility(source, List.of()));
      header.add(buildName(source, List.of()));

      add(header.build());
   }

   protected void leftSide() {
      var builder = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout()
         .clearPadding()
         .appendLayoutOptions(new GLayoutOptions().hGap(3));

      builder.add(buildVisibility(source, List.of()));

      if (source.isDerived()) {
         builder.add(new UmlGLabelBuilder<>(source, provider).text("/").build());
      }

      builder.add(buildName(source, List.of()));

      add(builder.build());
   }

   protected void rightSide() {
      var builder = new UmlGCompartmentBuilder<>(source, provider)
         .withHBoxLayout()
         .clearPadding()
         .appendLayoutOptions(new GLayoutOptions().hGap(3));

      var applied = new ArrayList<GModelElement>();
      applied.add(buildType());
      applied.add(buildMultiplicity());

      if (applied.stream().anyMatch(a -> a != null)) {
         var detailsBuilder = new UmlGCompartmentBuilder<>(source, provider)
            .withHBoxLayout()
            .clearPadding()
            .appendLayoutOptions(new GLayoutOptions().hGap(3));

         applied.forEach(a -> {
            if (a != null) {
               detailsBuilder.add(a);
            }
         });
         builder
            .add(new UmlGLabelBuilder<>(source, provider).text(":").build())
            .add(detailsBuilder.build());
      }

      add(builder.build());
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
            .clearPadding()
            .appendLayoutOptions(new GLayoutOptions().hGap(3));

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

   protected void applyIsStatic() {
      if (source.isStatic()) {
         addCssClass(CoreCSS.TEXT_UNDERLINE);
      }
   }

}

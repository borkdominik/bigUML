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
package com.eclipsesource.uml.glsp.uml.elements.named_element;

import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.element.GElementNodeBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;

public abstract class GNamedElementBuilder<TSource extends NamedElement, TProvider extends GIdGeneratorProvider & GIdContextGeneratorProvider & GSuffixProvider, TBuilder extends GNamedElementBuilder<TSource, TProvider, TBuilder>>
   extends GElementNodeBuilder<TSource, TProvider, TBuilder> {

   public final String HIGHLIGHT_ARG = "highlight";

   protected Optional<List<GModelElement>> headerElements = Optional.empty();

   public GNamedElementBuilder(final TSource source, final TProvider provider) {
      this(source, provider, DefaultTypes.NODE);
   }

   public GNamedElementBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareProperties() {
      super.prepareProperties();
      headerElements(initializeHeaderElements().orElse(null));
   }

   @Override
   protected void prepareLayout() {
      super.prepareLayout();

      this.layout(GConstants.Layout.VBOX)
         .layoutOptions(this.prepareLayoutOptions())
         .addCssClass(CoreCSS.NODE);
   }

   protected GLayoutOptions prepareLayoutOptions() {
      return new UmlGLayoutOptions().clearPadding();
   }

   @Override
   protected void prepareRepresentation() {
      super.prepareRepresentation();
      showHeader(this.headerElements);
   }

   protected abstract boolean hasChildren();

   public TBuilder headerElements(final List<GModelElement> elements) {
      this.headerElements = Optional.ofNullable(elements);
      return self();
   }

   protected Optional<List<GModelElement>> initializeHeaderElements() {
      return Optional.empty();
   }

   protected void showHeader(final Optional<List<GModelElement>> headerElements) {
      headerElements.ifPresent(elements -> {
         if (hasChildren()) {
            var header = new UmlGCompartmentBuilder<>(source, provider)
               .withHeaderLayout();

            header.addAll(elements);

            add(header.build());
         } else {
            // Show the header centered
            var header = new UmlGCompartmentBuilder<>(source, provider)
               .layout(GConstants.Layout.HBOX)
               .layoutOptions(new UmlGLayoutOptions()
                  .padding(UmlPaddingValues.LEVEL_1, UmlPaddingValues.LEVEL_2)
                  .hGrab(true)
                  .vGrab(true)
                  .vAlign(GConstants.VAlign.CENTER));
            var alignment = new UmlGCompartmentBuilder<>(source, provider)
               .layout(GConstants.Layout.VBOX)
               .layoutOptions(new UmlGLayoutOptions()
                  .hGrab(true)
                  .hAlign(GConstants.HAlign.CENTER));

            alignment.addAll(elements);
            header.add(alignment.build());

            add(header.build());
         }
      });
   }

   protected GLabel buildVisibility(final NamedElement element, final List<String> css) {
      return buildVisibility(element.getVisibility(), css);
   }

   protected GLabel buildVisibility(final VisibilityKind kind, final List<String> css) {
      return new UmlGLabelBuilder<>(source, provider, CoreTypes.LABEL_NAME)
         .addCssClasses(css)
         .text(VisibilityKindUtils.asSingleLabel(kind))
         .build();
   }

   protected GLabel buildName(final NamedElement source, final List<String> css) {
      return buildName(source.getName(), css);
   }

   protected GLabel buildName(final String name, final List<String> css) {
      return new UmlGLabelBuilder<>(source, provider, CoreTypes.LABEL_NAME)
         .id(provider.suffix().appendTo(NameLabelSuffix.SUFFIX, provider.idGenerator().getOrCreateId(source)))
         .addArgument(HIGHLIGHT_ARG, true)
         .addCssClasses(css)
         .text(name)
         .build();
   }

}

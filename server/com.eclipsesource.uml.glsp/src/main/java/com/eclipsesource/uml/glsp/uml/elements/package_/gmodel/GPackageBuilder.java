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
package com.eclipsesource.uml.glsp.uml.elements.package_.gmodel;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GNamedElementBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GPackageBuilder<TSource extends Package, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GPackageBuilder<TSource, TProvider, TBuilder>>
   extends GNamedElementBuilder<TSource, TProvider, TBuilder> {

   public GPackageBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareRepresentation() {
      super.prepareRepresentation();
      showChildren(source);
   }

   @Override
   protected Optional<List<GModelElement>> initializeHeaderElements() {
      return Optional.of(List.of(buildName(source, List.of(CoreCSS.FONT_BOLD))));
   }

   /*-
   protected GCompartment buildHeaderVer2(final Package source) {
      var hAlign = GConstants.HAlign.LEFT;
      var vAlign = GConstants.VAlign.TOP;
      var gap = 0;

      var builder = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX)
         .add(buildHeaderName(source, "--uml-package-icon"));

      final var uri = source.getURI();
      if (uri != null && uri.length() > 0) {
         gap = 1;
         builder.add(new GLabelBuilder(CoreTypes.LABEL_TEXT).id(idContextGenerator().getOrCreateId(source))
            .text("{uri=" + uri.toString() + "}").build());
      }

      final var nested = getPackagedElements(source).count();
      if (nested == 0 && !USE_PACKAGE_FOLDER_VIEW) {
         hAlign = GConstants.HAlign.CENTER;
         vAlign = GConstants.VAlign.CENTER;
      }

      return builder.layoutOptions(new GLayoutOptions().vGap(gap).hAlign(hAlign).vAlign(vAlign)).build();
   }
   */

   protected Stream<PackageableElement> getPackagedElements() { return source.getPackagedElements().stream(); }

   protected void showChildren(final TSource source) {
      add(new UmlGCompartmentBuilder<>(source, provider)
         .withFreeformLayout()
         .addAll(getPackagedElements()
            .map(e -> provider.gmodelMapHandler().handle(e))
            .collect(Collectors.toList()))
         .addAll(getPackagedElements()
            .map(e -> provider.gmodelMapHandler().handleSiblings(e))
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build());
   }
}

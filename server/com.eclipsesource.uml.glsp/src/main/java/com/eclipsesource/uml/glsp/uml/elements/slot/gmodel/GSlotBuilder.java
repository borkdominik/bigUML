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
package com.eclipsesource.uml.glsp.uml.elements.slot.gmodel;

import java.util.ArrayList;
import java.util.Optional;

import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.LiteralString;
import org.eclipse.uml2.uml.Slot;
import org.eclipse.uml2.uml.ValueSpecification;

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.elements.element.GElementNodeBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GSlotBuilder<TSource extends Slot, TProvider extends GIdGeneratorProvider & GIdContextGeneratorProvider & GSuffixProvider & ElementConfigurationAccessor, TBuilder extends GSlotBuilder<TSource, TProvider, TBuilder>>
   extends GElementNodeBuilder<TSource, TProvider, TBuilder> {

   public GSlotBuilder(final TSource source, final TProvider provider, final String type) {
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
         .layoutOptions(new UmlGLayoutOptions()
            .clearPadding()
            .hGap(3));
   }

   @Override
   protected void prepareRepresentation() {
      super.prepareRepresentation();
      showHeader(source);
   }

   protected void showHeader(final TSource source) {
      Optional<String> definingFeature = Optional.empty();
      var defFeature = source.getDefiningFeature();

      if (defFeature != null) {
         definingFeature = Optional.ofNullable(defFeature.getName());
      }

      // TODO: Add type

      var valueList = source.getValues();
      if (valueList.size() > 0) {
         var valuesAsStrings = new ArrayList<String>();

         for (ValueSpecification val : valueList) {
            if (val instanceof LiteralString) {
               valuesAsStrings.add(String.format("\"%s\"", val.stringValue()));
            } else if (val.stringValue() != null) {
               valuesAsStrings.add(val.stringValue());
            }
         }

         var valueLabel = String.join(", ", valuesAsStrings);

         definingFeature.ifPresentOrElse(f -> {
            add(new UmlGLabelBuilder<>(source, provider)
               .text(String.format("%s = %s", f, valueLabel))
               .build());
         }, () -> {
            add(new UmlGLabelBuilder<>(source, provider)
               .text(String.format("%s", valueLabel))
               .build());
         });

      } else if (definingFeature.isPresent()) {
         add(new UmlGLabelBuilder<>(source, provider)
            .text(String.format("%s", definingFeature.get()))
            .build());
      } else if (definingFeature.isEmpty()) {
         add(new UmlGLabelBuilder<>(source, provider)
            .text("<UNDEFINED>")
            .build());
      }
   }

}

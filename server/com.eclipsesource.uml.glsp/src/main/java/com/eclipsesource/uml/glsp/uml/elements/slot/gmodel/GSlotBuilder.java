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
import java.util.List;

import org.eclipse.glsp.graph.util.GConstants;
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
   protected void prepareLayout() {
      this.layout(GConstants.Layout.HBOX)
         .layoutOptions(new UmlGLayoutOptions()
            .hGap(3));
   }

   @Override
   protected void prepareRepresentation() {
      super.prepareRepresentation();
      showHeader(source);
   }

   protected void showHeader(final TSource source) {
      String definingFeature = "<UNDEFINED>";
      List<String> finalList = new ArrayList<>();

      var defFeature = source.getDefiningFeature();

      if (defFeature != null) {
         definingFeature = defFeature.getName();
      } else {
         definingFeature = "<UNDEFINED>";
      }

      // builder.add(separatorBuilder(source, ":").build());
      var valueList = source.getValues();
      add(new UmlGLabelBuilder<>(source, provider)
         .text(definingFeature)
         .build());
      if (!valueList.isEmpty()) {
         for (ValueSpecification val : valueList) {
            if (val.stringValue() != null) {
               finalList.add(val.stringValue());
            }

         }

         add(new UmlGLabelBuilder<>(source, provider)
            .text(" = " + finalList)
            .build());
      }
   }

}

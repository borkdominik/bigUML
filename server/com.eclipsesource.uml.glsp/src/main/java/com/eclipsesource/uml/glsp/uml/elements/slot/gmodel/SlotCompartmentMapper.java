/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
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

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Slot;
import org.eclipse.uml2.uml.ValueSpecification;

import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGModelMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.LabelGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class SlotCompartmentMapper extends RepresentationGModelMapper<Slot, GCompartment>
   implements LabelGBuilder {

   @Inject
   public SlotCompartmentMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Inject
   protected IdCountContextGenerator idCountGenerator;

   @Override
   public GCompartment map(final Slot source) {
      String definingFeature = "<UNDEFINED>";
      List<String> finalList = new ArrayList<>();

      var defFeature = source.getDefiningFeature();

      if (defFeature != null) {
         definingFeature = defFeature.getName();
      } else {
         definingFeature = "<UNDEFINED>";
      }
      var builder = new GCompartmentBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true));

      // builder.add(separatorBuilder(source, ":").build());
      var valueList = source.getValues();
      builder.add(textBuilder(source, definingFeature).build());
      if (!valueList.isEmpty()) {
         for (ValueSpecification val : valueList) {
            if (val.stringValue() != null) {
               finalList.add(val.stringValue());
            }

         }

         builder.add(textBuilder(source, " = " + finalList).build());
      }

      return builder.build();
   }

}

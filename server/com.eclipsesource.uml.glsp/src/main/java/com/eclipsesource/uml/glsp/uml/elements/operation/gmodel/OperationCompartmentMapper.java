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
package com.eclipsesource.uml.glsp.uml.elements.operation.gmodel;

import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.eclipsesource.uml.glsp.uml.elements.parameter.utils.ParameterPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGModelMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class OperationCompartmentMapper extends RepresentationGModelMapper<Operation, GCompartment>
   implements NamedElementGBuilder<Operation> {

   @Inject
   public OperationCompartmentMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GCompartment map(final Operation source) {
      var builder = new GCompartmentBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true))
         .add(buildIconVisibilityName(source, "--uml-operation-icon"));

      applyParameters(source, builder);
      applyReturns(source, builder);

      return builder.build();
   }

   protected void applyParameters(final Operation source, final GCompartmentBuilder builder) {
      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() != ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      builder.add(separatorBuilder(source, "(").build());

      for (int i = 0; i < parameters.size(); i++) {
         if (i > 0) {
            builder.add(separatorBuilder(source, ",").build());
         }

         builder.add(textBuilder(source, ParameterPropertyPaletteUtils.asText(parameters.get(i))).build());
      }

      builder.add(separatorBuilder(source, ")").build());
   }

   protected void applyReturns(final Operation source, final GCompartmentBuilder builder) {
      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() == ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      if (parameters.size() > 0) {
         builder.add(separatorBuilder(source, ":").build());

         for (int i = 0; i < parameters.size(); i++) {
            if (i > 0) {
               builder.add(separatorBuilder(source, ",").build());
            }

            builder.add(textBuilder(source, String.format("%s", TypeUtils.name(parameters.get(i).getType()))).build());
         }
      }
   }
}

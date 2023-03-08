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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel;

import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.glsp.uml.utils.element.ParameterUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.TypeUtils;

public final class OperationCompartmentMapper extends BaseGModelMapper<Operation, GCompartment>
   implements NamedElementGBuilder<Operation> {

   @Override
   public GCompartment map(final Operation source) {
      var builder = new GCompartmentBuilder(UmlClass_Operation.typeId())
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

         builder.add(textBuilder(source, ParameterUtils.asText(parameters.get(i))).build());
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

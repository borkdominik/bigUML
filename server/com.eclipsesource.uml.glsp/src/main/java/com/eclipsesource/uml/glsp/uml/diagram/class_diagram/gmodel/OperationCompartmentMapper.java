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
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.SeparatorBuilder;
import com.eclipsesource.uml.glsp.uml.utils.ParameterUtils;
import com.eclipsesource.uml.glsp.uml.utils.TypeUtils;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;

public final class OperationCompartmentMapper extends BaseGModelMapper<Operation, GCompartment>
   implements SeparatorBuilder {

   @Override
   public GCompartment map(final Operation source) {
      var builder = new GCompartmentBuilder(UmlClass_Operation.TYPE_ID)
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true))
         .add(buildIcon(source))
         .add(buildVisibility(source))
         .add(buildName(source));

      applyParameters(source, builder);
      applyReturns(source, builder);

      return builder.build();
   }

   protected GCompartment buildIcon(final Operation source) {
      return new GCompartmentBuilder(UmlClass_Operation.ICON)
         .id(idCountGenerator.getOrCreateId(source))
         .build();
   }

   protected GLabel buildName(final Operation operation) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(NameLabelSuffix.SUFFIX, idGenerator.getOrCreateId(operation)))
         .text(operation.getName())
         .build();
   }

   protected GLabel buildVisibility(final NamedElement source) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(idCountGenerator.getOrCreateId(source))
         .text(VisibilityKindUtils.asSingleLabel(source.getVisibility()))
         .build();
   }

   protected void applyParameters(final Operation source, final GCompartmentBuilder builder) {
      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() != ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      builder.add(buildSeparator(source, "("));

      for (int i = 0; i < parameters.size(); i++) {
         if (i > 0) {
            builder.add(buildSeparator(source, ","));
         }
         builder.add(buildParameter(source, parameters.get(i)));
      }

      builder.add(buildSeparator(source, ")"));
   }

   protected void applyReturns(final Operation source, final GCompartmentBuilder builder) {
      var parameters = source.getOwnedParameters().stream()
         .filter(p -> p.getDirection() == ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());

      if (parameters.size() > 0) {
         builder.add(buildSeparator(source, ":"));

         for (int i = 0; i < parameters.size(); i++) {
            if (i > 0) {
               builder.add(buildSeparator(source, ","));
            }
            builder.add(buildReturn(source, parameters.get(i)));
         }
      }
   }

   protected GLabel buildParameter(final Operation source, final Parameter parameter) {

      return new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(idContextGenerator().getOrCreateId(source))
         .text(ParameterUtils.asText(parameter))
         .build();
   }

   protected GLabel buildReturn(final Operation source, final Parameter parameter) {
      var type = TypeUtils.name(parameter.getType());

      return new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(idContextGenerator().getOrCreateId(source))
         .text(String.format("%s", type))
         .build();
   }
}

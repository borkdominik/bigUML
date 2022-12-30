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
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.CompartmentSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderLabelSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.HeaderTypeSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;

public final class PrimitiveTypeNodeMapper extends BaseGNodeMapper<PrimitiveType, GNode> {

   @Override
   public GNode map(final PrimitiveType primitiveType) {
      var builder = new GNodeBuilder(ClassTypes.PRIMITIVE_TYPE)
         .id(idGenerator.getOrCreateId(primitiveType))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(primitiveType))
         .add(buildCompartment(primitiveType));

      applyShapeNotation(primitiveType, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final PrimitiveType primitiveType) {
      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .id(suffix.appendTo(HeaderSuffix.SUFFIX, idGenerator.getOrCreateId(primitiveType)))
         .layout(GConstants.Layout.VBOX);

      var typeLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(suffix.appendTo(HeaderTypeSuffix.SUFFIX, idGenerator.getOrCreateId(primitiveType)))
         .text("«PrimitiveType»")
         .build();
      builder.add(typeLabel);

      var nameLabel = new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(HeaderLabelSuffix.SUFFIX, idGenerator.getOrCreateId(primitiveType)))
         .text(primitiveType.getName())
         .build();
      builder.add(nameLabel);

      return builder.build();
   }

   protected GCompartment buildCompartment(final PrimitiveType primitiveType) {

      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT)
         .id(suffix.appendTo(CompartmentSuffix.SUFFIX, idGenerator.getOrCreateId(primitiveType)))
         .layout(GConstants.Layout.VBOX);

      var layoutOptions = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      builder.layoutOptions(layoutOptions);

      var propertyElements = primitiveType.getOwnedAttributes().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      builder.addAll(propertyElements);

      var operationElements = primitiveType.getOwnedOperations().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      builder.addAll(operationElements);

      return builder.build();
   }
}

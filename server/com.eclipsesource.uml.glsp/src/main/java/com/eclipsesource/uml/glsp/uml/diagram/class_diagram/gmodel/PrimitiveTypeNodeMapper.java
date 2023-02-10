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
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PrimitiveType;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;

public final class PrimitiveTypeNodeMapper extends BaseGNodeMapper<PrimitiveType, GNode> {

   @Override
   public GNode map(final PrimitiveType source) {
      var builder = new GNodeBuilder(UmlClass_PrimitiveType.TYPE_ID)
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final PrimitiveType source) {
      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX);

      var typeLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(idCountGenerator.getOrCreateId(source))
         .text("«PrimitiveType»")
         .build();
      builder.add(typeLabel);

      builder.add(buildVisibility(source));

      var nameLabel = new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(NameLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)))
         .text(source.getName())
         .build();
      builder.add(nameLabel);

      return builder.build();
   }

   protected GLabel buildVisibility(final NamedElement source) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(idCountGenerator.getOrCreateId(source))
         .text(VisibilityKindUtils.asAscii(source.getVisibility()))
         .build();
   }

   protected GCompartment buildCompartment(final PrimitiveType source) {

      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX);

      var layoutOptions = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      builder.layoutOptions(layoutOptions);

      var propertyElements = source.getOwnedAttributes().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      builder.addAll(propertyElements);

      var operationElements = source.getOwnedOperations().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      builder.addAll(operationElements);

      return builder.build();
   }
}

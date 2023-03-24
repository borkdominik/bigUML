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
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PrimitiveType;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public final class PrimitiveTypeNodeMapper extends BaseGNodeMapper<PrimitiveType, GNode>
   implements NamedElementGBuilder<PrimitiveType> {

   @Override
   public GNode map(final PrimitiveType source) {
      var builder = new GNodeBuilder(UmlClass_PrimitiveType.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final PrimitiveType source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(buildHeaderAnnotation(source, QuotationMark.quoteDoubleAngle("DataType")));
      header.add(buildHeaderName(source, "--uml-primitive-type-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment(final PrimitiveType source) {

      var compartment = fixedChildrenCompartmentBuilder(source);

      var propertyElements = source.getOwnedAttributes().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(propertyElements);

      var operationElements = source.getOwnedOperations().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(operationElements);

      return compartment.build();
   }
}

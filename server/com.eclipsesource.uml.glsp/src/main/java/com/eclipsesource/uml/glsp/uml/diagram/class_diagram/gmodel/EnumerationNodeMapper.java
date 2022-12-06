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

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderIconSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderLabelSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.HeaderOuterSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.HeaderTypeSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;

public class EnumerationNodeMapper extends BaseGNodeMapper<Enumeration, GNode> {
   @Override
   public GNode map(final Enumeration umlEnumeration) {
      var builder = new GNodeBuilder(ClassTypes.ENUMERATION)
         .id(idGenerator.getOrCreateId(umlEnumeration))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(umlEnumeration));

      applyShapeNotation(umlEnumeration, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Enumeration umlEnumeration) {
      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.VBOX)
         .id(suffix.appendTo(HeaderOuterSuffix.SUFFIX, idGenerator.getOrCreateId(umlEnumeration)));

      var typeLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(suffix.appendTo(HeaderTypeSuffix.SUFFIX, idGenerator.getOrCreateId(umlEnumeration)))
         .text("<<" + Enumeration.class.getSimpleName() + ">>").build();
      builder.add(typeLabel);

      var compBuilder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.HBOX)
         .id(suffix.appendTo(HeaderSuffix.SUFFIX, idGenerator.getOrCreateId(umlEnumeration)));

      var icon = new GCompartmentBuilder(ClassTypes.ICON_ENUMERATION)
         .id(suffix.appendTo(HeaderIconSuffix.SUFFIX, idGenerator.getOrCreateId(umlEnumeration))).build();
      compBuilder.add(icon);

      var nameLabel = new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(HeaderLabelSuffix.SUFFIX, idGenerator.getOrCreateId(umlEnumeration)))
         .text(umlEnumeration.getName())
         .build();
      compBuilder.add(nameLabel);

      builder.add(compBuilder.build());

      return builder.build();
   }
}

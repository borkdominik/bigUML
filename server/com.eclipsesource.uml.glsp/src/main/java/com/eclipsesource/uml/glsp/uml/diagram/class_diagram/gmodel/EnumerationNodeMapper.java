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
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.CompartmentSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderIconSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderLabelSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.HeaderOuterSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.HeaderTypeSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;

public final class EnumerationNodeMapper extends BaseGNodeMapper<Enumeration, GNode> {
   @Override
   public GNode map(final Enumeration enumeration) {
      var builder = new GNodeBuilder(ClassTypes.ENUMERATION)
         .id(idGenerator.getOrCreateId(enumeration))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(enumeration))
         .add(buildLiterals(enumeration));

      applyShapeNotation(enumeration, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Enumeration enumeration) {
      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .id(suffix.appendTo(HeaderOuterSuffix.SUFFIX, idGenerator.getOrCreateId(enumeration)))
         .layout(GConstants.Layout.VBOX);

      var typeLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(suffix.appendTo(HeaderTypeSuffix.SUFFIX, idGenerator.getOrCreateId(enumeration)))
         .text("«Enumeration»")
         .build();
      builder.add(typeLabel);

      var compBuilder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .id(suffix.appendTo(HeaderSuffix.SUFFIX, idGenerator.getOrCreateId(enumeration)))
         .layout(GConstants.Layout.HBOX);

      var icon = new GCompartmentBuilder(ClassTypes.ICON_ENUMERATION)
         .id(suffix.appendTo(HeaderIconSuffix.SUFFIX, idGenerator.getOrCreateId(enumeration)))
         .build();
      compBuilder.add(icon);

      var nameLabel = new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(HeaderLabelSuffix.SUFFIX, idGenerator.getOrCreateId(enumeration)))
         .text(enumeration.getName())
         .build();
      compBuilder.add(nameLabel);

      builder.add(compBuilder.build());

      return builder.build();
   }

   protected GCompartment buildLiterals(final Enumeration enumeration) {
      var literals = enumeration.getOwnedLiterals();

      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT)
         .id(suffix.appendTo(CompartmentSuffix.SUFFIX, idGenerator.getOrCreateId(enumeration)))
         .layout(GConstants.Layout.VBOX);

      var layoutOptions = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      builder.layoutOptions(layoutOptions);

      var literalElements = literals.stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      builder.addAll(literalElements);

      return builder.build();

   }
}

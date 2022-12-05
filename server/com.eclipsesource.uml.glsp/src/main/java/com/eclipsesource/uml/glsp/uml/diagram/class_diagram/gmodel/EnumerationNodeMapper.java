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
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.ClassSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public class EnumerationNodeMapper extends BaseGModelMapper<Enumeration, GNode> {
   @Inject
   private ClassSuffix classSuffix;

   @Override
   public GNode map(final Enumeration umlEnumeration) {
      var builder = new GNodeBuilder(ClassTypes.ENUMERATION)
         .id(idGenerator.getOrCreateId(umlEnumeration))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(umlEnumeration));

      applyShapeData(umlEnumeration, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Enumeration umlEnumeration) {
      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.VBOX)
         .id(classSuffix.headerOuterSuffix.appendTo(idGenerator.getOrCreateId(umlEnumeration)));

      var typeLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(classSuffix.headerTypeSuffix.appendTo(idGenerator.getOrCreateId(umlEnumeration)))
         .text("<<" + Enumeration.class.getSimpleName() + ">>").build();
      builder.add(typeLabel);

      var compBuilder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.HBOX)
         .id(suffix.headerSuffix.appendTo(idGenerator.getOrCreateId(umlEnumeration)));

      var icon = new GCompartmentBuilder(ClassTypes.ICON_ENUMERATION)
         .id(suffix.headerIconSuffix.appendTo(idGenerator.getOrCreateId(umlEnumeration))).build();
      compBuilder.add(icon);

      var nameLabel = new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.headerLabelSuffix.appendTo(idGenerator.getOrCreateId(umlEnumeration)))
         .text(umlEnumeration.getName())
         .build();
      compBuilder.add(nameLabel);

      builder.add(compBuilder.build());

      return builder.build();
   }

   protected void applyShapeData(final Classifier classifier, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }
}

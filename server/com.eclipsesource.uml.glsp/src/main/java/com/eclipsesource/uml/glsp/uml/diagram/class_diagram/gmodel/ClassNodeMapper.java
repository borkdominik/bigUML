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

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.CompartmentSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderIconSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderLabelSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.HeaderSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.HeaderTypeSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;

public class ClassNodeMapper extends BaseGNodeMapper<Class, GNode> {

   @Override
   public GNode map(final Class umlClass) {
      var builder = new GNodeBuilder(ClassTypes.CLASS);

      if (umlClass.isAbstract()) {
         builder = new GNodeBuilder(ClassTypes.ABSTRACT_CLASS);
      }

      builder.id(idGenerator.getOrCreateId(umlClass))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(umlClass))
         .add(buildCompartment(umlClass));

      applyShapeNotation(umlClass, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Class source) {
      return mapHandler.handle(source.getGeneralizations());
   }

   protected GCompartment buildHeader(final Class umlClass) {
      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT_HEADER)
         .id(suffix.appendTo(HeaderSuffix.SUFFIX, idGenerator.getOrCreateId(umlClass)));

      if (umlClass.isAbstract()) {
         builder
            .layout(GConstants.Layout.VBOX);

         var typeLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
            .id(suffix.appendTo(HeaderTypeSuffix.SUFFIX, idGenerator.getOrCreateId(umlClass)))
            .text("{abstract}")
            .build();
         builder.add(typeLabel);

      } else {
         builder
            .layout(GConstants.Layout.HBOX);

         var icon = new GCompartmentBuilder(ClassTypes.ICON_CLASS)
            .id(suffix.appendTo(HeaderIconSuffix.SUFFIX, idGenerator.getOrCreateId(umlClass)))
            .build();
         builder.add(icon);
      }

      var nameLabel = new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(HeaderLabelSuffix.SUFFIX, idGenerator.getOrCreateId(umlClass)))
         .text(umlClass.getName()).build();
      builder.add(nameLabel);

      return builder.build();
   }

   protected GCompartment buildCompartment(final Class umlClass) {
      var properties = umlClass.getAllAttributes();

      var builder = new GCompartmentBuilder(CoreTypes.COMPARTMENT)
         .id(suffix.appendTo(CompartmentSuffix.SUFFIX, idGenerator.getOrCreateId(umlClass)))
         .layout(GConstants.Layout.VBOX);

      var layoutOptions = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      builder.layoutOptions(layoutOptions);

      var propertyElements = properties.stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      builder.addAll(propertyElements);

      return builder.build();
   }
}

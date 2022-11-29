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
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.ClassSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public class ClassNodeMapper extends BaseGModelMapper<Class, GNode> {
   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   private Suffix suffix;

   @Inject
   private ClassSuffix classSuffix;

   @Inject
   private UmlModelState modelState;

   @Inject
   private GModelMapHandler mapHandler;

   @Override
   public GNode map(final Class umlClass) {
      var builder = new GNodeBuilder(ClassTypes.CLASS);

      if (umlClass.isAbstract()) {
         builder = new GNodeBuilder(ClassTypes.ABSTRACT_CLASS);
      }

      builder.id(idGenerator.getOrCreateId(umlClass))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(UmlConfig.CSS.NODE)
         .add(buildHeader(umlClass))
         .add(buildCompartment(umlClass));

      applyNotation(umlClass, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Class source) {
      return buildGeneralizations(source);
   }

   protected GCompartment buildHeader(final Class umlClass) {
      var builder = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
         .id(suffix.headerSuffix.appendTo(idGenerator.getOrCreateId(umlClass)));

      if (umlClass.isAbstract()) {
         builder
            .layout(GConstants.Layout.VBOX);

         var typeLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
            .id(classSuffix.headerTypeSuffix.appendTo(idGenerator.getOrCreateId(umlClass)))
            .text("{abstract}")
            .build();
         builder.add(typeLabel);

      } else {
         builder
            .layout(GConstants.Layout.HBOX);

         var classHeaderIcon = new GCompartmentBuilder(ClassTypes.ICON_CLASS)
            .id(suffix.headerIconSuffix.appendTo(idGenerator.getOrCreateId(umlClass)))
            .build();
         builder.add(classHeaderIcon);
      }

      var classHeaderLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
         .id(suffix.headerLabelSuffix.appendTo(idGenerator.getOrCreateId(umlClass)))
         .text(umlClass.getName()).build();
      builder.add(classHeaderLabel);

      return builder.build();
   }

   protected GCompartment buildCompartment(final Class umlClass) {
      var properties = umlClass.getAllAttributes();

      var builder = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT)
         .id(suffix.compartmentSuffix.appendTo(idGenerator.getOrCreateId(umlClass)))
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

   protected List<GModelElement> buildGeneralizations(final Class umlClass) {
      return mapHandler.handle(umlClass.getGeneralizations());
   }

   protected void applyNotation(final Class umlClass, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(umlClass, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }

         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }
}

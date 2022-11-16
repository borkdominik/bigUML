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

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
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
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public class ClassNodeMapper extends BaseGModelMapper<Class, GNode> {
   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   private Suffix suffix;

   @Inject
   private UmlModelState modelState;

   @Inject
   private GModelMapHandler mapHandler;

   @Override
   public GNode map(final Class umlClass) {
      if (umlClass.isAbstract()) {
         GNodeBuilder b = new GNodeBuilder(ClassTypes.ABSTRACT_CLASS)
            .id(idGenerator.getOrCreateId(umlClass))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(UmlConfig.CSS.NODE)
            .add(buildClassHeader(umlClass))
            .add(buildClassPropertiesCompartment(umlClass.getAttributes(), umlClass));
         applyShapeData(umlClass, b);
         return b.build();
      }
      GNodeBuilder b = new GNodeBuilder(ClassTypes.CLASS)
         .id(idGenerator.getOrCreateId(umlClass))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(UmlConfig.CSS.NODE)
         .add(buildClassHeader(umlClass))
         .add(buildClassPropertiesCompartment(umlClass.getAttributes(), umlClass));
      applyShapeData(umlClass, b);
      return b.build();
   }

   protected GCompartment buildClassHeader(final Class umlClass) {

      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER);

      if (umlClass.isAbstract()) {
         classHeaderBuilder
            .layout(GConstants.Layout.VBOX)
            .id(suffix.headerSuffix.appendTo(idGenerator.getOrCreateId(umlClass)));

         GLabel typeLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
            .id(suffix.headerLabelSuffix.appendTo(idGenerator.getOrCreateId(umlClass)) + "_type_header")
            .text("{abstract}")
            .build();
         classHeaderBuilder.add(typeLabel);

      } else {
         classHeaderBuilder
            .layout(GConstants.Layout.HBOX)
            .id(suffix.headerSuffix.appendTo(idGenerator.getOrCreateId(umlClass)));

         GCompartment classHeaderIcon = new GCompartmentBuilder(ClassTypes.ICON_CLASS)
            .id(suffix.headerIconSuffix.appendTo(idGenerator.getOrCreateId(umlClass))).build();
         classHeaderBuilder.add(classHeaderIcon);
      }

      GLabel classHeaderLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
         .id(suffix.headerLabelSuffix.appendTo(idGenerator.getOrCreateId(umlClass)))
         .text(umlClass.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

   protected GCompartment buildClassPropertiesCompartment(final Collection<? extends Property> properties,
      final Classifier parent) {
      GCompartmentBuilder classPropertiesBuilder = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT)
         .id(suffix.compartmentSuffix.appendTo(idGenerator.getOrCreateId(parent))).layout(GConstants.Layout.VBOX);

      GLayoutOptions layoutOptions = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      classPropertiesBuilder.layoutOptions(layoutOptions);

      List<GModelElement> propertiesElements = properties.stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      classPropertiesBuilder.addAll(propertiesElements);

      return classPropertiesBuilder.build();
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

   protected void applyShapeData(final Element element, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(element, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

}

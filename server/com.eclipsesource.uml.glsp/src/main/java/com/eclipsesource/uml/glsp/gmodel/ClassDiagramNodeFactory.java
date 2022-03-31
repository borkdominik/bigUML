/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
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
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Property;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class ClassDiagramNodeFactory extends AbstractGModelFactory<Classifier, GNode> {

   // private final LabelFactory labelFactory;
   private final CompartmentLabelFactory compartmentLabelFactory;

   public ClassDiagramNodeFactory(final UmlModelState modelState, final CompartmentLabelFactory compartmentLabelFactory) {
      super(modelState);
      this.compartmentLabelFactory = compartmentLabelFactory;
   }

   @Override
   public GNode create(final Classifier classifier) {
      if (classifier instanceof Class) {
         return createClassNode((Class) classifier);
      }
      return null;
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

   // CLASS DIAGRAM
   protected GNode createClassNode(final Class umlClass) {
      GNodeBuilder b = new GNodeBuilder(Types.CLASS)
            .id(toId(umlClass))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildClassHeader(umlClass))
            .add(buildClassPropertiesCompartment(umlClass.getAttributes(), umlClass));

      applyShapeData(umlClass, b);
      return b.build();
   }

   protected GCompartment buildClassHeader(final Class umlClass) {
      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.HBOX)
            .id(UmlIDUtil.createHeaderId(toId(umlClass)));

      GCompartment classHeaderIcon = new GCompartmentBuilder(getType(umlClass))
            .id(UmlIDUtil.createHeaderIconId(toId(umlClass))).build();
      classHeaderBuilder.add(classHeaderIcon);

      GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlClass)))
            .text(umlClass.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

   protected static String getType(final Classifier classifier) {
      if (classifier instanceof Class) {
         return Types.ICON_CLASS;
      }
      return "Classifier not found";

   }

   protected GCompartment buildClassPropertiesCompartment(final Collection<? extends Property> properties,
                                                          final Classifier parent) {
      GCompartmentBuilder classPropertiesBuilder = new GCompartmentBuilder(Types.COMPARTMENT)
            .id(UmlIDUtil.createChildCompartmentId(toId(parent))).layout(GConstants.Layout.VBOX);

      GLayoutOptions layoutOptions = new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true);
      classPropertiesBuilder.layoutOptions(layoutOptions);

      List<GModelElement> propertiesElements = properties.stream()
            .map(compartmentLabelFactory::createPropertyLabel)
            .collect(Collectors.toList());
      classPropertiesBuilder.addAll(propertiesElements);

      return classPropertiesBuilder.build();
   }

}

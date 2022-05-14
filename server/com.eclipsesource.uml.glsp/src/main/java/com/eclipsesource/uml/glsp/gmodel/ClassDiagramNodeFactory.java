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
import org.eclipse.uml2.uml.*;

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
      } else if (classifier instanceof Interface) {
         return createInterfaceNode((Interface) classifier);
      } else if (classifier instanceof Enumeration) {
         return createEnumerationNode((Enumeration) classifier);
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

   // CLASS
   protected GNode createClassNode(final Class umlClass) {
      if (umlClass.isAbstract()) {
         GNodeBuilder b = new GNodeBuilder(Types.ABSTRACT_CLASS)
               .id(toId(umlClass))
               .layout(GConstants.Layout.VBOX)
               .addCssClass(CSS.NODE)
               .add(buildClassHeader(umlClass))
               .add(buildClassPropertiesCompartment(umlClass.getAttributes(), umlClass));
         applyShapeData(umlClass, b);
         return b.build();
      }
      GNodeBuilder b = new GNodeBuilder(Types.CLASS)
            .id(toId(umlClass))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildClassHeader(umlClass))
            .add(buildClassPropertiesCompartment(umlClass.getAttributes(), umlClass));
      applyShapeData(umlClass, b);
      return b.build();
   }

   // INTERFACE
   protected GNode createInterfaceNode(final Interface umlInterface) {
      GNodeBuilder b = new GNodeBuilder(Types.INTERFACE)
            .id(toId(umlInterface))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildInterfaceHeader(umlInterface));
      applyShapeData(umlInterface, b);
      return b.build();
   }

   // ENUMERATION
   protected GNode createEnumerationNode(final Enumeration umlEnumeration) {
      GNodeBuilder b = new GNodeBuilder(Types.ENUMERATION)
            .id(toId(umlEnumeration))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildEnumerationHeader(umlEnumeration));
      applyShapeData(umlEnumeration, b);
      return b.build();
   }


   protected GCompartment buildInterfaceHeader(final Interface umlInterface) {
      GCompartmentBuilder interfaceHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.VBOX)
            .id(UmlIDUtil.createHeaderId(toId(umlInterface)));

      GLabel typeLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlInterface)) + "_type_header")
            .text("«interface»")
            .build();
      interfaceHeaderBuilder.add(typeLabel);

      GLabel interfaceHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlInterface)))
            .text(umlInterface.getName())
            .build();
      interfaceHeaderBuilder.add(interfaceHeaderLabel);
      return interfaceHeaderBuilder.build();
   }

   protected GCompartment buildClassHeader(final Class umlClass) {

      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER);

      if (umlClass.isAbstract()) {
         classHeaderBuilder
               .layout(GConstants.Layout.VBOX)
               .id(UmlIDUtil.createHeaderId(toId(umlClass)));

         GLabel typeLabel = new GLabelBuilder(Types.LABEL_NAME)
               .id(UmlIDUtil.createHeaderLabelId(toId(umlClass)) + "_type_header")
               .text("{abstract}")
               .build();
         classHeaderBuilder.add(typeLabel);

      } else {
         classHeaderBuilder
               .layout(GConstants.Layout.HBOX)
               .id(UmlIDUtil.createHeaderId(toId(umlClass)));

         GCompartment classHeaderIcon = new GCompartmentBuilder(getType(umlClass))
               .id(UmlIDUtil.createHeaderIconId(toId(umlClass))).build();
         classHeaderBuilder.add(classHeaderIcon);
      }

      GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlClass)))
            .text(umlClass.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

   protected GCompartment buildEnumerationHeader(final Enumeration umlEnumeration) {
      GCompartmentBuilder outerEnumHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.VBOX)
            .id(UmlIDUtil.createOuterHeaderId(toId(umlEnumeration)));

      GLabel headerTypeLabel = new GLabelBuilder(Types.LABEL_TEXT)
            .id(UmlIDUtil.createTypeHeaderId(toId(umlEnumeration)))
            .text("<<" + Enumeration.class.getSimpleName() + ">>").build();
      outerEnumHeaderBuilder.add(headerTypeLabel);

      GCompartmentBuilder headerCompartmentBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.HBOX)
            .id(UmlIDUtil.createHeaderId(toId(umlEnumeration)));

      GCompartment enumHeaderIcon = new GCompartmentBuilder(Types.ICON_ENUMERATION)
            .id(UmlIDUtil.createHeaderIconId(toId(umlEnumeration))).build();
      headerCompartmentBuilder.add(enumHeaderIcon);

      GLabel enumHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlEnumeration))).text(umlEnumeration.getName()).build();
      headerCompartmentBuilder.add(enumHeaderLabel);

      GCompartment enumHeaderCompartment = headerCompartmentBuilder.build();
      outerEnumHeaderBuilder.add(enumHeaderCompartment);

      return outerEnumHeaderBuilder.build();
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

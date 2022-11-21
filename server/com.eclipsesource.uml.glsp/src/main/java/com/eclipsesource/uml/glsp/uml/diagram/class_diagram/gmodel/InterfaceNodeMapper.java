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
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.old.utils.UmlIDUtil;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public class InterfaceNodeMapper extends BaseGModelMapper<Interface, GNode> {
   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   private Suffix suffix;

   @Inject
   private UmlModelState modelState;

   @Inject
   private GModelMapHandler mapHandler;

   @Override
   public GNode map(final Interface umlInterface) {
      GNodeBuilder b = new GNodeBuilder(ClassTypes.INTERFACE)
         .id(idGenerator.getOrCreateId(umlInterface))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(UmlConfig.CSS.NODE)
         .add(buildInterfaceHeader(umlInterface));
      applyShapeData(umlInterface, b);
      return b.build();
   }

   protected GCompartment buildInterfaceHeader(final Interface umlInterface) {
      GCompartmentBuilder interfaceHeaderBuilder = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.VBOX)
         .id(suffix.headerSuffix.appendTo(idGenerator.getOrCreateId(umlInterface)));

      GLabel typeLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
         .id(suffix.headerLabelSuffix.appendTo(idGenerator.getOrCreateId(umlInterface)) + "_type_header")
         .text("«interface»")
         .build();
      interfaceHeaderBuilder.add(typeLabel);

      GLabel interfaceHeaderLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
         .id(suffix.headerLabelSuffix.appendTo(idGenerator.getOrCreateId(umlInterface)))
         .text(umlInterface.getName())
         .build();
      interfaceHeaderBuilder.add(interfaceHeaderLabel);
      return interfaceHeaderBuilder.build();
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

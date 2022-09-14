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
package com.eclipsesource.uml.glsp.uml.communication_diagram.gmodel;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.gmodel.CompartmentLabelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;

public class CommunicationLifelineNodeFactory extends AbstractGModelFactory<Lifeline, GNode> {

   public CommunicationLifelineNodeFactory(final UmlModelState modelState,
      final CompartmentLabelFactory compartmentLabelFactory) {
      super(modelState);
   }

   @Override
   public GNode create(final Lifeline lifeline) {
      return createLifelineNode(lifeline);
   }

   protected void applyShapeData(final Element element, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(element, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GNode createLifelineNode(final Lifeline umlLifeline) {
      GNodeBuilder lifelineNodeBuilder = new GNodeBuilder(Types.LIFELINE)
         .id(toId(umlLifeline))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CSS.NODE);

      applyShapeData(umlLifeline, lifelineNodeBuilder);

      GCompartment classHeader = buildClassHeader(umlLifeline);
      lifelineNodeBuilder.add(classHeader);

      return lifelineNodeBuilder.build();
   }

   protected GCompartment buildClassHeader(final Lifeline umlLifeline) {
      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.HBOX)
         .id(UmlIDUtil.createHeaderId(toId(umlLifeline)));

      GCompartment classHeaderIcon = new GCompartmentBuilder(Types.ICON_LIFELINE)
         .id(UmlIDUtil.createHeaderIconId(toId(umlLifeline))).build();
      classHeaderBuilder.add(classHeaderIcon);

      GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
         .id(UmlIDUtil.createHeaderLabelId(toId(umlLifeline)))
         .text(umlLifeline.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

}

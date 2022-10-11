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
package com.eclipsesource.uml.glsp.diagram.communication_diagram.gmodel;

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
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.core.gmodel.UmlGModelMapper;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.core.utils.UmlIDUtil;
import com.eclipsesource.uml.glsp.diagram.communication_diagram.constants.CommunicationTypes;
import com.google.inject.Inject;

public class CommunicationLifelineNodeMapper implements UmlGModelMapper<Lifeline, GNode> {
   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   private UmlModelState modelState;

   @Override
   public GNode map(final Lifeline lifeline) {
      GNodeBuilder lifelineNodeBuilder = new GNodeBuilder(CommunicationTypes.LIFELINE)
         .id(idGenerator.getOrCreateId(lifeline))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(UmlConfig.CSS.NODE);

      applyShapeData(lifeline, lifelineNodeBuilder);

      GCompartment classHeader = buildClassHeader(lifeline);
      lifelineNodeBuilder.add(classHeader);

      return lifelineNodeBuilder.build();
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

   protected GCompartment buildClassHeader(final Lifeline umlLifeline) {
      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.HBOX)
         .id(UmlIDUtil.createHeaderId(idGenerator.getOrCreateId(umlLifeline)));

      GCompartment classHeaderIcon = new GCompartmentBuilder(CommunicationTypes.ICON_LIFELINE)
         .id(UmlIDUtil.createHeaderIconId(idGenerator.getOrCreateId(umlLifeline))).build();
      classHeaderBuilder.add(classHeaderIcon);

      GLabel classHeaderLabel = new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
         .id(UmlIDUtil.createHeaderLabelId(idGenerator.getOrCreateId(umlLifeline)))
         .text(umlLifeline.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

}

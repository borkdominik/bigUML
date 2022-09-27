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

import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.glsp.gmodel.UmlGModelMapHandler;
import com.eclipsesource.uml.glsp.gmodel.UmlGModelMapper;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.communication_diagram.constants.CommunicationConfig;
import com.eclipsesource.uml.glsp.util.UmlConfig;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.inject.Inject;

public class CommunicationInteractionNodeMapper implements UmlGModelMapper<Interaction, GNode> {

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   @Inject
   private UmlModelState modelState;

   @Inject
   private UmlGModelMapHandler mapHandler;

   @Override
   public GNode map(final Interaction interaction) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      Collection<EObject> children = new LinkedList<>();
      children.addAll(interaction.getLifelines());
      children.addAll(interaction.getMessages());

      GNodeBuilder builder = new GNodeBuilder(CommunicationConfig.Types.INTERACTION)
         .id(UmlIDUtil.toId(modelState, interaction))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .addCssClass(UmlConfig.CSS.NODE)
         .add(buildInteractionHeader(interaction))
         .add(createInteractionChildrenCompartment(interaction, children));

      applyShapeData(interaction, builder);
      return builder.build();
   }

   protected void applyShapeData(final Classifier classifier, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            GDimension size = GraphUtil.copy(shape.getSize());
            builder.size(size);
            builder.layoutOptions(Map.of(
               GLayoutOptions.KEY_PREF_WIDTH, size.getWidth(),
               GLayoutOptions.KEY_PREF_HEIGHT, size.getHeight()));
         }
      });
   }

   protected GCompartment buildInteractionHeader(final Interaction umlInteraction) {
      return new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT_HEADER)
         .layout(GConstants.Layout.HBOX)
         .id(UmlIDUtil.createHeaderId(UmlIDUtil.toId(modelState, umlInteraction)))
         .add(new GCompartmentBuilder(CommunicationConfig.Types.ICON_INTERACTION)
            .id(UmlIDUtil.createHeaderIconId(UmlIDUtil.toId(modelState, umlInteraction))).build())
         .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(UmlIDUtil.toId(modelState, umlInteraction)))
            .text(umlInteraction.getName()).build())
         .build();
   }

   protected GCompartment createInteractionChildrenCompartment(final Interaction interaction,
      final Collection<? extends EObject> children) {
      Map<String, Object> layoutOptions = new HashMap<>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);

      return new GCompartmentBuilder(UmlConfig.Types.COMPARTMENT)
         .id(UmlIDUtil.createChildCompartmentId(UmlIDUtil.toId(modelState, interaction)))
         .layout(GConstants.Layout.FREEFORM)
         .layoutOptions(layoutOptions)
         .addAll(children.stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .build();
   }
}

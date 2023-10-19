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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel;

import java.util.Map;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.ExecutionSpecification;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.MessageEnd;
import org.eclipse.uml2.uml.MessageSort;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.constants.SequenceCSS;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Lifeline;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class LifelineNodeMapper extends BaseGNodeMapper<Lifeline, GNode> implements NamedElementGBuilder<Lifeline> {

   GLayoutOptions layoutOptions = new GLayoutOptions()
      .hAlign(GConstants.HAlign.CENTER)
      .prefWidth(0);

   @Override
   public GNode map(final Lifeline lifeline) {
      var builder = new GNodeBuilder(UmlSequence_Lifeline.typeId())
         .id(idGenerator.getOrCreateId(lifeline))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(lifeline))
         .add(buildTimeline(lifeline));

      if (isCreated(lifeline)) {
         builder.addCssClass(SequenceCSS.LIFELINE_CREATED);
      }

      applyShapeNotation(lifeline, builder);

      return builder.build();
   }

   @Override
   protected void applyShapeNotation(final Lifeline element, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(element, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            GDimension size = GraphUtil.copy(shape.getSize());
            builder.size(size);
            builder.layoutOptions(Map.of(
               GLayoutOptions.KEY_PREF_HEIGHT, size.getHeight(), GLayoutOptions.KEY_PADDING_TOP, 0));
         }
      });
   }

   protected void applyHeaderShapeNotation(final Lifeline element, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(element, Shape.class).ifPresent(shape -> {
         if (shape.getSize() != null) {
            GDimension size = GraphUtil.dimension(shape.getSize().getWidth(), 40);
            builder.size(size);
            builder.layoutOptions(Map.of(
               GLayoutOptions.KEY_PREF_WIDTH, size.getWidth(),
               GLayoutOptions.KEY_PREF_HEIGHT, 40));
         }
      });
   }

   protected GCompartment buildHeader(final Lifeline source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new GLayoutOptions().hAlign(GConstants.HAlign.CENTER).paddingTop(5));

      header.add(buildIconName(source, "--uml-lifeline-icon"));

      return header.build();
   }

   protected GCompartment buildTimeline(
      final Lifeline source) {

      GLayoutOptions layoutOptions = new GLayoutOptions()
         .hAlign(GConstants.HAlign.CENTER)
         .prefWidth(0);

      var builder = new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.FREEFORM)
         .layoutOptions(layoutOptions);

      var coveredInteractionFragments = source.getCoveredBys().stream()
         .filter(f -> !(f instanceof ExecutionSpecification) &&
            !((f instanceof MessageEnd)
               && ((MessageEnd) f).getMessage().getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL
               && ((MessageEnd) f).getMessage().getReceiveEvent() == f))

         .map(mapHandler::handle)
         .collect(Collectors.toList());

      var coveredExecutionSpecifications = source.getCoveredBys().stream()
         .filter(f -> (f instanceof ExecutionSpecification))
         .map(mapHandler::handle)
         .collect(Collectors.toList());

      builder.addAll(coveredInteractionFragments);
      builder.addAll(coveredExecutionSpecifications);

      return builder.build();
   }

   private boolean isCreated(final Lifeline lifeline) {
      return lifeline.getCoveredBys().stream()
         .filter(f -> (f instanceof MessageEnd)
            && ((MessageEnd) f).getMessage().getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL
            && ((MessageEnd) f).getMessage().getReceiveEvent() == f)
         .count() > 0;
   }

   private boolean isDestructed(final Lifeline lifeline) {
      return lifeline.getCoveredBys().stream()
         .filter(f -> (f instanceof MessageEnd)
            && ((MessageEnd) f).getMessage().getMessageSort() == MessageSort.DELETE_MESSAGE_LITERAL
            && ((MessageEnd) f).getMessage().getReceiveEvent() == f)
         .count() > 0;
   }
}

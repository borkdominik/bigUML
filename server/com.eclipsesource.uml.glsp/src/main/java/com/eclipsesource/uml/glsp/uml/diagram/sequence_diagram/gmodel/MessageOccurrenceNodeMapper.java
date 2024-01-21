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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.gmodel.builder.CompartmentGBuilder;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_MessageOccurrence;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class MessageOccurrenceNodeMapper extends BaseGNodeMapper<MessageOccurrenceSpecification, GNode>
   implements NamedElementGBuilder<MessageOccurrenceSpecification> {

   @Override
   public GNode map(final MessageOccurrenceSpecification source) {

      var builder = new GNodeBuilder(UmlSequence_MessageOccurrence.typeId());

      builder.id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.PORT);

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected void applyShapeNotation(final MessageOccurrenceSpecification source, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(source, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            if (source.getCovered() != null) {
               // reset x position to 0 to keep centered
               builder.position(GraphUtil.point(0, shape.getPosition().getY()));
            }
         }
         if (shape.getSize() != null) {
            var size = GraphUtil.copy(shape.getSize());
            builder.size(size);
         }
      });
   }

   @Override
   public GCompartmentBuilder freeformChildrenCompartmentBuilder(final EObject source) {
      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idContextGenerator().getOrCreateId(source))
         .addArgument(CompartmentGBuilder.childrenContainerKey, true)
         .layout(GConstants.Layout.FREEFORM)
         .layoutOptions(new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true));
   }
}

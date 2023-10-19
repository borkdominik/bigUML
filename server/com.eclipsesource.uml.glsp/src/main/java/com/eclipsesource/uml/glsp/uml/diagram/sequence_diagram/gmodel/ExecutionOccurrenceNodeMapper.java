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

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.ExecutionOccurrenceSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_ExecutionOccurrence;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class ExecutionOccurrenceNodeMapper extends BaseGNodeMapper<ExecutionOccurrenceSpecification, GNode>
   implements NamedElementGBuilder<ExecutionOccurrenceSpecification> {

   @Override
   public GNode map(final ExecutionOccurrenceSpecification source) {
      var builder = new GNodeBuilder(UmlSequence_ExecutionOccurrence.typeId());

      builder.id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.PORT);

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   protected void applyShapeNotation(final ExecutionOccurrenceSpecification source, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(source, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            // reset x position to 0 to keep centered
            builder.position(GraphUtil.point(0, shape.getPosition().getY()));
         }
         if (shape.getSize() != null) {
            var size = GraphUtil.copy(shape.getSize());
            builder.size(size);
         }
      });
   }
}

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

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_MessageAnchor;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.modelserver.model.MessageAnchor;

public class MessageAnchorNodeMapper extends BaseGNodeMapper<MessageAnchor, GNode> {

   @Override
   public GNode map(final MessageAnchor source) {
      var builder = new GNodeBuilder(UmlSequence_MessageAnchor.typeId());
      builder
         .id(source.getId())
         .addCssClass(CoreCSS.PORT);

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected void applyShapeNotation(final MessageAnchor source, final GNodeBuilder builder) {
      var id = source.getId();

      modelState.getIndex().getNotation(id, Shape.class).ifPresentOrElse(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            var size = GraphUtil.copy(shape.getSize());
            builder.size(size);
         }
      }, () -> {
         var shape = modelState.getNotationDirectly(id, Shape.class);
         builder.size(GraphUtil.copy(shape.get().getSize()));
         builder.position(GraphUtil.copy(shape.get().getPosition()));
      });
   }
}

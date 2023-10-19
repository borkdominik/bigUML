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

import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.BehaviorExecutionSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_BehaviorExecution;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class BehaviorExecutionNodeMapper extends BaseGNodeMapper<BehaviorExecutionSpecification, GNode>
   implements NamedElementGBuilder<BehaviorExecutionSpecification> {

   @Override
   public GNode map(final BehaviorExecutionSpecification source) {
      var builder = new GNodeBuilder(UmlSequence_BehaviorExecution.typeId());

      builder.id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.NODE);

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public void applyShapeNotation(final BehaviorExecutionSpecification element, final GNodeBuilder builder) {

      double fixedWidth = 10;

      modelState.getIndex().getNotation(element, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            var centeredPosition = GraphUtil.copy(shape.getPosition());
            centeredPosition.setX(0);
            builder.position(centeredPosition);
            // builder.addLayoutOptions(new GLayoutOptions()
            // .hAlign(GConstants.HAlign.CENTER));
         }
         if (shape.getSize() != null) {
            GDimension size = GraphUtil.copy(shape.getSize());
            builder.size(fixedWidth, size.getHeight());
            builder.addLayoutOptions(Map.of(
               GLayoutOptions.KEY_PREF_WIDTH, fixedWidth,
               GLayoutOptions.KEY_PREF_HEIGHT, size.getHeight()));
         }
      });
   }
}

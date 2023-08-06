/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Actor;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Actor;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class ActorNodeMapper extends BaseGNodeMapper<Actor, GNode>
   implements NamedElementGBuilder<Actor> {

   @Override
   public GNode map(final Actor source) {
      var builder = new GNodeBuilder(UmlUseCase_Actor.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX);

      builder
         .add(buildStickFigureWithName(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildStickFigureWithName(final Actor source) {
      var compartment = compartmentBuilder(source)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new GLayoutOptions().hAlign(GConstants.HAlign.CENTER).vGap(5))
         .addCssClass(CoreCSS.NODE);

      var stickFigure = new GNodeBuilder(UmlUseCase_Actor.GModel.stickFigureNodeTypeId())
         .id(idContextGenerator().getOrCreateId(source))
         .addCssClass(CoreCSS.NODE)
         .build();

      if (source.isAbstract()) {
         compartment
            .add(stickFigure)
            .add(buildHeaderAnnotation(source, QuotationMark.quoteDoubleAngle("abstract")))
            .add(nameBuilder(source).build());
      } else {
         compartment
            .add(stickFigure)
            .add(nameBuilder(source).build());
      }

      return compartment.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Actor source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));

      return siblings;
   }
}

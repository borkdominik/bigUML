/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.glsp.graph.GPort;
import org.eclipse.glsp.graph.builder.impl.GPortBuilder;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.PseudostateKind;

public class ConnectionPointPortFactory extends AbstractGModelFactory<Pseudostate, GPort> {

   public ConnectionPointPortFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GPort create(final Pseudostate umlPseudostate) {
      switch (umlPseudostate.getKind().getValue()) {
         case PseudostateKind.ENTRY_POINT:
            return createEntryPoint(umlPseudostate);
         case PseudostateKind.EXIT_POINT:
            return createExitPoint(umlPseudostate);
      }
      return null;
   }

   protected GPort createEntryPoint(final Pseudostate entryPoint) {

      GPortBuilder b = new GPortBuilder(Types.ENTRY_POINT)
         .id(toId(entryPoint))
         .size(30, 30)
         .addCssClass(CSS.NODE);

      applyShapeData(entryPoint, b);
      return b.build();
   }

   protected GPort createExitPoint(final Pseudostate exitPoint) {
      GPortBuilder b = new GPortBuilder(Types.EXIT_POINT)
         .id(toId(exitPoint))
         .size(30, 30)
         .addCssClass(CSS.NODE);

      applyShapeData(exitPoint, b);
      return b.build();
   }

   protected void applyShapeData(final Pseudostate pseudostate, final GPortBuilder builder) {
      modelState.getIndex().getNotation(pseudostate, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

}

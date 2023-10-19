/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GPort;
import org.eclipse.glsp.graph.builder.impl.GPortBuilder;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;

public abstract class BaseGPortMapper<Source extends EObject, Target extends GPort>
   extends BaseGModelMapper<Source, Target> {

   protected void applyShapeNotation(final Source source, final GPortBuilder builder) {
      modelState.getIndex().getNotation(source, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            var centeredPosition = GraphUtil.copy(shape.getPosition());
            centeredPosition.setX(0);
            builder.position(centeredPosition);
         }

         if (shape.getSize() != null) {
            var size = GraphUtil.copy(shape.getSize());
            builder.size(size);
         }
      });
   }
}

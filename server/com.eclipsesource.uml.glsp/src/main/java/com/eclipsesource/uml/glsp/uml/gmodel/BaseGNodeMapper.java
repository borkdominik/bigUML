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
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;

public abstract class BaseGNodeMapper<Source extends EObject, Target extends GNode>
   extends BaseGModelMapper<Source, Target> {

   protected void applyShapeNotation(final Source source, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(source, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }

         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }
}

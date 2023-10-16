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
package com.eclipsesource.uml.glsp.uml.gmodel.builder;

import org.eclipse.glsp.graph.GShapeElement;
import org.eclipse.glsp.graph.builder.GShapeElementBuilder;

public abstract class UmlGShapeElementBuilder<TShape extends GShapeElement, TBuilder extends GShapeElementBuilder<TShape, TBuilder>>
   extends GShapeElementBuilder<TShape, TBuilder> {

   public UmlGShapeElementBuilder(final String type) {
      super(type);
   }

   @Override
   protected TBuilder self() {
      return (TBuilder) this;
   }
}

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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.builder;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.GCContainer;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.properties.GPropertyCollection;

public abstract class GModelComponentBuilder<TSource extends EObject, TElement extends GModelElement> {
   protected final TSource source;

   protected final GModelContext context;

   public GModelComponentBuilder(final GModelContext context, final TSource source) {
      super();
      this.context = context;
      this.source = source;
   }

   protected GPropertyCollection getRootGModelProperties() {
      return GPropertyCollection.of();
   }

   protected abstract TElement createRootGModel();

   protected abstract GCContainer createRootComponent();

   public TElement build() {
      var root = createRootGModel();
      var properties = getRootGModelProperties();
      properties.assign(root);
      properties.assign(source, root);

      root.getChildren().add(createRootComponent().buildGModel());

      return root;
   }
}

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
package com.eclipsesource.uml.glsp.uml.elements.element;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.builder.AbstractGEdgeBuilder;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;

public abstract class GElementEdgeBuilder<TSource extends Element, TProvider extends GIdGeneratorProvider & GIdContextGeneratorProvider, TBuilder extends GElementEdgeBuilder<TSource, TProvider, TBuilder>>
   extends AbstractGEdgeBuilder<GEdge, TBuilder> {
   /*
    * To identify if the GModel has been build by a builder
    */
   public final String BUILD_BY = "build_by";

   protected final TSource source;
   protected final TProvider provider;

   public GElementEdgeBuilder(final TSource source, final TProvider provider, final String type) {
      super(type);
      this.source = source;
      this.provider = provider;
   }

   protected void prepare() {
      prepareProperties();
      prepareLayout();
      prepareRepresentation();
   }

   /**
    * Prepare the required properties
    */
   protected void prepareProperties() {
      if (this.id == null) {
         this.id(provider.idGenerator().getOrCreateId(source));
      }

      // TODO: Remove after switching to builder based approach for all gmodels
      this.addArgument(BUILD_BY, "gbuilder");
   }

   /**
    * Prepare the layout
    */
   protected void prepareLayout() {}

   protected void prepareRepresentation() {}

   @Override
   protected void setProperties(final GEdge edge) {
      this.prepare();

      super.setProperties(edge);
   }

   @Override
   protected GEdge instantiate() {
      return GraphFactory.eINSTANCE.createGEdge();
   }

   @Override
   protected TBuilder self() {
      return (TBuilder) this;
   }
}

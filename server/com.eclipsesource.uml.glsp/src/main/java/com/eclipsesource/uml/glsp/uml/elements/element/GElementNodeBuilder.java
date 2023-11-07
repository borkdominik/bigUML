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

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.builder.AbstractGNodeBuilder;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;

public abstract class GElementNodeBuilder<TSource extends Element, TProvider extends GIdGeneratorProvider & GIdContextGeneratorProvider, TBuilder extends GElementNodeBuilder<TSource, TProvider, TBuilder>>
   extends AbstractGNodeBuilder<GNode, TBuilder> {
   /*
    * To identify if the GModel has been build by a builder
    */
   public final String BUILD_BY = "build_by";
   public final String BORDER_ARG = "border";

   /*
    * Draw a border around the element
    */
   protected boolean border = false;

   protected final TSource source;
   protected final TProvider provider;

   public GElementNodeBuilder(final TSource source, final TProvider provider, final String type) {
      super(type);
      this.source = source;
      this.provider = provider;
   }

   /**
    * Prepare the required properties
    */
   protected void prepareProperties() {
      this.id(provider.idGenerator().getOrCreateId(source));

      // TODO: Remove after switching to builder based approach for all gmodels
      this.addArgument(BUILD_BY, "gbuilder");

      border(true);
   }

   /**
    * Prepare the layout
    */
   protected void prepareLayout() {}

   protected void prepareRepresentation() {}

   @Override
   protected void setProperties(final GNode node) {
      // TODO: Overrides if properties are changed from outside
      prepareProperties();
      prepareLayout();
      prepareRepresentation();
      super.setProperties(node);

      node.getArgs().put(BORDER_ARG, this.border);
   }

   public TBuilder border(final boolean enabled) {
      this.border = enabled;
      return self();
   }

   @Override
   protected GNode instantiate() {
      return GraphFactory.eINSTANCE.createGNode();
   }

   @Override
   protected TBuilder self() {
      return (TBuilder) this;
   }
}

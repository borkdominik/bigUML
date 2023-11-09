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

import java.util.Optional;

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
   public final String SELECTION_BORDER_ARG = "selection_border";

   /*
    * Draw a border around the element
    */
   protected Optional<Boolean> border = Optional.empty();
   /*
    * Draw a border around the element if the element is selected
    */
   protected Optional<Boolean> selectionBorder = Optional.empty();

   protected final TSource source;
   protected final TProvider provider;

   public GElementNodeBuilder(final TSource source, final TProvider provider, final String type) {
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

      if (border.isEmpty()) {
         border(true);
      }
   }

   /**
    * Prepare the layout
    */
   protected void prepareLayout() {}

   protected void prepareRepresentation() {}

   public TBuilder border(final boolean enabled) {
      this.border = Optional.of(enabled);
      return self();
   }

   public TBuilder selectionBorder(final boolean enabled) {
      this.selectionBorder = Optional.of(enabled);
      return self();
   }

   @Override
   protected void setProperties(final GNode node) {
      this.prepare();

      super.setProperties(node);

      this.border.ifPresent(v -> node.getArgs().put(BORDER_ARG, v));

      this.selectionBorder.ifPresent(v -> node.getArgs().put(SELECTION_BORDER_ARG, v));
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

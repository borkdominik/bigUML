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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.builder.AbstractGNodeBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

@Deprecated
public class UmlGDividerBuilder<TProvider extends GIdContextGeneratorProvider & GSuffixProvider>
   extends AbstractGNodeBuilder<GNode, UmlGDividerBuilder<?>> {

   protected EObject source;
   protected TProvider provider;

   public UmlGDividerBuilder(final EObject source, final TProvider provider) {
      super(CoreTypes.DIVIDER);
      this.source = source;
      this.provider = provider;

      prepare();
   }

   protected void prepare() {
      var options = new UmlGLayoutOptions().hGrab(true);
      this
         .id(provider.idContextGenerator().getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(options);
   }

   public UmlGDividerBuilder<TProvider> addSubtitle(final String subtitle) {
      add(new GLabelBuilder()
         .id(provider.idContextGenerator().getOrCreateId(source))
         .text(subtitle)
         .addCssClass(CoreCSS.DIVIDER_SUBTITLE)
         .build());
      return self();
   }

   @Override
   protected GNode instantiate() {
      return GraphFactory.eINSTANCE.createGNode();
   }

   @Override
   protected UmlGDividerBuilder<TProvider> self() {
      return this;
   }
}

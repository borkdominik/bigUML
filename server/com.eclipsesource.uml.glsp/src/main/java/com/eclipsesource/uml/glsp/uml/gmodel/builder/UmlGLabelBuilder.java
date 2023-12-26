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
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.builder.AbstractGLabelBuilder;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

@Deprecated
public class UmlGLabelBuilder<TProvider extends GIdContextGeneratorProvider & GSuffixProvider>
   extends AbstractGLabelBuilder<GLabel, UmlGLabelBuilder<?>> {

   protected final EObject source;
   protected final TProvider provider;

   public UmlGLabelBuilder(final EObject source, final TProvider provider) {
      this(source, provider, CoreTypes.LABEL_TEXT);
   }

   public UmlGLabelBuilder(final EObject source, final TProvider provider, final String type) {
      super(type);

      this.source = source;
      this.provider = provider;

      this.prepare();
   }

   protected void prepare() {
      this.id(provider.idContextGenerator().getOrCreateId(source));
   }

   public UmlGLabelBuilder<?> text(final String seperator, final String... text) {
      return text(String.join(seperator, text));
   }

   @Override
   protected GLabel instantiate() {
      return GraphFactory.eINSTANCE.createGLabel();
   }

   @Override
   protected UmlGLabelBuilder<?> self() {
      return this;
   }
}

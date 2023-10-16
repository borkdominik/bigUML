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

import java.util.List;

import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GraphFactory;
import org.eclipse.glsp.graph.builder.AbstractGNodeBuilder;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public abstract class UmlGNamedElementBuilder<TSource extends NamedElement, TProvider extends GIdGeneratorProvider & GIdContextGeneratorProvider & GSuffixProvider, TBuilder extends AbstractGNodeBuilder<GNode, TBuilder>>
   extends AbstractGNodeBuilder<GNode, TBuilder> {

   protected final TSource source;
   protected final TProvider provider;

   public UmlGNamedElementBuilder(final TSource source, final TProvider provider) {
      this(source, provider, DefaultTypes.NODE);
   }

   public UmlGNamedElementBuilder(final TSource source, final TProvider provider, final String type) {
      super(type);
      this.source = source;
      this.provider = provider;
   }

   protected GLabel buildName(final NamedElement element, final List<String> css) {
      return buildName(element.getName(), css);
   }

   protected GLabel buildName(final String text, final List<String> css) {
      return new UmlGLabelBuilder<>(source, provider, CoreTypes.LABEL_NAME)
         .id(provider.suffix().appendTo(NameLabelSuffix.SUFFIX, provider.idGenerator().getOrCreateId(source)))
         .addArgument("highlight", true)
         .addCssClasses(css)
         .text(source.getName())
         .build();
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

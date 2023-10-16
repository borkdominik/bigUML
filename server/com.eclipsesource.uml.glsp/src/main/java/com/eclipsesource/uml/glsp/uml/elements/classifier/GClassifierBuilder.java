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
package com.eclipsesource.uml.glsp.uml.elements.classifier;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.AbstractGNodeBuilder;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.OperationOwner;

import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGDividerBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGNamedElementBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GClassifierBuilder<TSource extends Classifier & AttributeOwner & OperationOwner, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends AbstractGNodeBuilder<GNode, TBuilder>>
   extends UmlGNamedElementBuilder<TSource, TProvider, TBuilder> {

   public GClassifierBuilder(final TSource source, final TProvider provider) {
      super(source, provider);
   }

   public GClassifierBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   public List<GModelElement> listAttributes() {
      var entries = new ArrayList<GModelElement>();

      var filteredProperties = source.getOwnedAttributes().stream()
         .filter(p -> p.getAssociation() == null)
         .collect(Collectors.toList());

      if (filteredProperties.size() > 0) {
         entries.add(new UmlGDividerBuilder<>(source, provider).build());
         entries.addAll(filteredProperties.stream()
            .map(e -> provider.gmodelMapHandler().handle(e))
            .collect(Collectors.toList()));
      }

      return entries;
   }

   public List<GModelElement> listOperations() {
      var entries = new ArrayList<GModelElement>();
      var operations = source.getOwnedOperations();

      if (operations.size() > 0) {
         entries.add(new UmlGDividerBuilder<>(source, provider).build());
         entries.addAll(operations.stream()
            .map(e -> provider.gmodelMapHandler().handle(e))
            .collect(Collectors.toList()));
      }

      return entries;
   }
}

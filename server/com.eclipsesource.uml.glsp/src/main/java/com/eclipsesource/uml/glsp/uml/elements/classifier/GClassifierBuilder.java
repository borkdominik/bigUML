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

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.OperationOwner;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.uml.elements.named_element.GNamedElementBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGDividerBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlGapValues;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;

public class GClassifierBuilder<TSource extends Classifier & AttributeOwner & OperationOwner, TProvider extends GSuffixProvider & GIdGeneratorProvider & GIdContextGeneratorProvider & GModelMapHandlerProvider, TBuilder extends GClassifierBuilder<TSource, TProvider, TBuilder>>
   extends GNamedElementBuilder<TSource, TProvider, TBuilder> {

   public GClassifierBuilder(final TSource source, final TProvider provider) {
      super(source, provider);
   }

   public GClassifierBuilder(final TSource source, final TProvider provider, final String type) {
      super(source, provider, type);
   }

   @Override
   protected void prepareRepresentation() {
      super.prepareRepresentation();
      showAttributesAndOperations(source);
   }

   @Override
   protected boolean hasChildren() {
      return hasAttributesOrOperations(source);
   }

   protected boolean hasAttributesOrOperations(final TSource source) {
      return attributes(source).size() > 0 || operations(source).size() > 0;
   }

   protected void showAttributesAndOperations(final TSource source) {
      var compartment = new UmlGCompartmentBuilder<>(source, provider)
         .withVBoxLayout();

      var attributes = attributesAsGModels();
      var operations = operationsAsGModels();

      if (attributes.size() > 0 || operations.size() > 0) {
         compartment
            .addAll(attributes)
            .addAll(operations);

         add(compartment.build());
      }
   }

   protected List<Property> attributes(final TSource source) {
      return source.getOwnedAttributes().stream()
         .filter(p -> p.getAssociation() == null)
         .collect(Collectors.toList());
   }

   // TODO: Make protected
   public List<GModelElement> attributesAsGModels() {
      var entries = new ArrayList<GModelElement>();

      var properties = attributes(source);

      if (properties.size() > 0) {
         var root = new UmlGCompartmentBuilder<>(source, provider)
            .withVBoxLayout();

         root.add(
            new UmlGDividerBuilder<>(source, provider).build());

         var elements = new UmlGCompartmentBuilder<>(source, provider)
            .withVBoxLayout()
            .addLayoutOptions(new UmlGLayoutOptions()
               .padding(UmlPaddingValues.LEVEL_1, UmlPaddingValues.LEVEL_2)
               .vGap(UmlGapValues.LEVEL_1));

         elements.addAll(properties.stream()
            .map(e -> provider.gmodelMapHandler().handle(e))
            .collect(Collectors.toList()));

         root.add(elements.build());
         entries.add(root.build());
      }

      return entries;
   }

   protected EList<Operation> operations(final TSource source) {
      return source.getOwnedOperations();
   }

   public List<GModelElement> operationsAsGModels() {
      var entries = new ArrayList<GModelElement>();
      var operations = operations(source);

      if (operations.size() > 0) {
         var container = new UmlGCompartmentBuilder<>(source, provider)
            .withVBoxLayout();

         var elementContainer = new UmlGCompartmentBuilder<>(source, provider)
            .withVBoxLayout()
            .addLayoutOptions(new UmlGLayoutOptions()
               .padding(UmlPaddingValues.LEVEL_1, UmlPaddingValues.LEVEL_2)
               .vGap(UmlGapValues.LEVEL_1));

         container.add(new UmlGDividerBuilder<>(source, provider).build());
         elementContainer.addAll(operations.stream()
            .map(e -> provider.gmodelMapHandler().handle(e))
            .collect(Collectors.toList()));

         container.add(elementContainer.build());
         entries.add(container.build());
      }

      return entries;
   }
}

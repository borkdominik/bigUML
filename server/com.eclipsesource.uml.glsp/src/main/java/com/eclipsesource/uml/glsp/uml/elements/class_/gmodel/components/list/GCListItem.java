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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.components.list;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.element.GCModelElement;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;

public class GCListItem extends GCModelElement {
   public static final String CSS_ID = "gc-list-item";
   protected final GModelElement item;

   public GCListItem(final GModelContext context, final EObject source, final GModelElement item) {
      this(context, source, item, new Options());
   }

   public GCListItem(final GModelContext context, final EObject source, final GModelElement item,
      final Options options) {
      super(context, source);

      setRootGModel(createRootGModel());
      this.item = item;
   }

   @Override
   protected Optional<String> getCssIdentifier() { return Optional.of(CSS_ID); }

   protected GModelElement createRootGModel() {
      return new UmlGCompartmentBuilder<>(source, context)
         .withVBoxLayout()
         .addLayoutOptions(new UmlGLayoutOptions()
            .padding(UmlPaddingValues.NONE, UmlPaddingValues.LEVEL_2))
         .build();
   }

   @Override
   public GModelElement buildGModel() {
      var element = super.buildGModel();

      element.getChildren().add(item);

      return element;
   }

   public static class Options {}

}

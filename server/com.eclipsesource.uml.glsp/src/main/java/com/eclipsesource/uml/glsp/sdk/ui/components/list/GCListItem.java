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
package com.eclipsesource.uml.glsp.sdk.ui.components.list;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCIdentifiable;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelElement;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;

public class GCListItem extends GCModelElement<EObject, GModelElement> implements GCIdentifiable {
   public static final String CSS_ID = "gc-list-item";
   protected final GModelElement item;

   public GCListItem(final GModelContext context, final EObject source, final GModelElement item) {
      this(context, source, item, new Options());
   }

   public GCListItem(final GModelContext context, final EObject source, final GModelElement item,
      final Options options) {
      super(context, source);
      this.item = item;
   }

   @Override
   public String getIdentifier() { return CSS_ID; }

   @Override
   protected Optional<GModelElement> createRootGModel() {
      return Optional.of(new UmlGCompartmentBuilder<>(origin, context)
         .withVBoxLayout()
         .addLayoutOptions(new UmlGLayoutOptions()
            .padding(UmlPaddingValues.NONE, UmlPaddingValues.LEVEL_2))
         .build());
   }

   @Override
   protected void extendGModel(final GModelElement gmodel) {
      gmodel.getChildren().add(item);
   }

   public static class Options {}

}

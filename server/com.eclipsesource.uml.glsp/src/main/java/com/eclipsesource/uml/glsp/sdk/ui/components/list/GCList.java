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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCIdentifiable;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGDividerBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlGapValues;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;

public class GCList extends GCModelList<EObject, GModelElement> implements GCIdentifiable {
   public static final String CSS_ID = "gc-list";
   protected Options options;
   protected ArrayList<Integer> dividerIndex = new ArrayList<>();

   public GCList(final GModelContext context, final EObject source) {
      this(context, source, new Options());
   }

   public GCList(final GModelContext context, final EObject source, final Options options) {
      super(context, source);
      this.options = options;
   }

   @Override
   public String getIdentifier() { return CSS_ID; }

   @Override
   public boolean add(final GCProvider e) {
      dividerIndex.add(size());
      return super.add(e);
   }

   @Override
   public boolean addAll(final Collection<? extends GCProvider> children) {
      dividerIndex.add(size());
      return super.addAll(children);
   }

   @Override
   protected void assignChildrenToGModel(final GModelElement rootGModel) {
      var gmodel = getChildrenGModel();
      var children = getAssignableChildren();
      var dividerIterator = dividerIndex.iterator();
      var dividerI = -1;

      for (int i = 0; i < children.size(); i++) {
         if (dividerI != i & dividerIterator.hasNext()) {
            dividerI = dividerIterator.next();
         }
         if (dividerI == i) {
            gmodel.getChildren()
               .add(new UmlGDividerBuilder<>(origin, context).build());
         }
         var child = children.get(i);

         assignChildToGModel(gmodel, child);
      }
   }

   @Override
   protected Optional<GModelElement> createRootGModel() {
      if (this.options.rootGModel.isPresent()) {
         return this.options.rootGModel;
      }

      return Optional.of(new UmlGCompartmentBuilder<>(origin, context)
         .withVBoxLayout()
         .addLayoutOptions(new UmlGLayoutOptions()
            .paddingBottom(UmlPaddingValues.LEVEL_1)
            .vGap(UmlGapValues.LEVEL_1))
         .build());
   }

   public static class Options {
      public boolean dividerBeforeInserts = false;
      public Optional<GModelElement> rootGModel = Optional.empty();
   }

}

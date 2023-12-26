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

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.GComponent;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.element.GCContainerElement;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.element.GCModelElement;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGDividerBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlGapValues;
import com.eclipsesource.uml.glsp.uml.gmodel.constants.UmlPaddingValues;

public class GCList extends GCContainerElement {
   public static final String CSS_ID = "gc-list";
   protected final Options options;

   public GCList(final GModelContext context, final EObject source) {
      this(context, source, new Options());
   }

   public GCList(final GModelContext context, final EObject source, final Options options) {
      super(context, source);
      this.options = options;

      assignRootGModel(createRootGModel());
   }

   @Override
   protected Optional<String> getCssIdentifier() { return Optional.of(CSS_ID); }

   @Override
   public void addAll(final Collection<GComponent> children) {
      if (children.size() > 0) {
         if (options.dividerBeforeGroup) {
            super.addAll(
               List.of(new GCModelElement(context, source, new UmlGDividerBuilder<>(source, context).build())));
         }

         super.addAll(children);
      }
   }

   protected GModelElement createRootGModel() {
      return new UmlGCompartmentBuilder<>(source, context)
         .withVBoxLayout()
         .addLayoutOptions(new UmlGLayoutOptions()
            .paddingBottom(UmlPaddingValues.LEVEL_1)
            .vGap(UmlGapValues.LEVEL_1))
         .build();
   }

   public static class Options {
      public boolean dividerBeforeGroup = false;
   }

}

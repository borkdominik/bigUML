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
package com.eclipsesource.uml.glsp.uml.elements.slot.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.LiteralString;
import org.eclipse.uml2.uml.Slot;
import org.eclipse.uml2.uml.ValueSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCModelBuilder;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GModelProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GSelectionBorderProperty;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;

public class GSlotBuilder<TOrigin extends Slot>
   extends GCModelBuilder<TOrigin, GNode> {
   protected final String type;

   public GSlotBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin);

      this.type = type;
   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator().getOrCreateId(origin))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new UmlGLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(CoreCSS.NODE)
         .build();
   }

   @Override
   protected List<GModelProperty> getRootGModelProperties() { return List.of(new GSelectionBorderProperty()); }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GNode modelRoot) {
      var root = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      root.addAll(List.of(createHeader(root)));

      return root;
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      Optional<String> definingFeature = Optional.empty();
      var defFeature = origin.getDefiningFeature();

      if (defFeature != null) {
         definingFeature = Optional.ofNullable(defFeature.getName());
      }

      // TODO: Add type
      var valueList = origin.getValues();
      if (valueList.size() > 0) {
         var valuesAsStrings = new ArrayList<String>();

         for (ValueSpecification val : valueList) {
            if (val instanceof LiteralString) {
               valuesAsStrings.add(String.format("\"%s\"", val.stringValue()));
            } else if (val.stringValue() != null) {
               valuesAsStrings.add(val.stringValue());
            }
         }

         var valueLabel = String.join(", ", valuesAsStrings);

         definingFeature.ifPresentOrElse(f -> {
            container.add(new UmlGLabelBuilder<>(origin, context)
               .text(String.format("%s = %s", f, valueLabel))
               .build());
         }, () -> {
            container.add(new UmlGLabelBuilder<>(origin, context)
               .text(String.format("%s", valueLabel))
               .build());
         });

      } else if (definingFeature.isPresent()) {
         container.add(new UmlGLabelBuilder<>(origin, context)
            .text(String.format("%s", definingFeature.get()))
            .build());
      } else if (definingFeature.isEmpty()) {
         container.add(new UmlGLabelBuilder<>(origin, context)
            .text("<UNDEFINED>")
            .build());
      }

      return container;
   }
}

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
package com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCNameLabel;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GModelProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GSelectionBorderProperty;
import com.eclipsesource.uml.glsp.uml.elements.instance_specification.gmodel.GInstanceSpecificationBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;

public class GEnumerationLiteralBuilder<TOrigin extends EnumerationLiteral>
   extends GInstanceSpecificationBuilder<TOrigin> {

   public GEnumerationLiteralBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
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
   protected GCModelList<?, ?> createRootComponent(final GNode gmodelRoot) {
      var root = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      root.addAll(List.of(createHeader(root)));

      return root;
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> container) {
      var nameLabelOptions = new GCNameLabel.Options(origin.getName());
      nameLabelOptions.css.clear();
      nameLabelOptions.css.add(CoreCSS.TEXT_HIGHLIGHT);
      return new GCNameLabel(context, origin, nameLabelOptions);
   }
}

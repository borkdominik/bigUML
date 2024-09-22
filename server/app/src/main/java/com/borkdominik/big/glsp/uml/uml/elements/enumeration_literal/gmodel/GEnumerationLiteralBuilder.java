/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.enumeration_literal.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLayoutOptions;
import com.borkdominik.big.glsp.server.sdk.ui.components.label.GCNameLabel;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GModelProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GNotationProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GSelectionBorderProperty;
import com.borkdominik.big.glsp.uml.uml.elements.instance_specification.gmodel.GInstanceSpecificationBuilder;

public class GEnumerationLiteralBuilder<TOrigin extends EnumerationLiteral>
   extends GInstanceSpecificationBuilder<TOrigin> {

   public GEnumerationLiteralBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator.getOrCreateId(origin))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new BCLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(BGCoreCSS.NODE)
         .build();
   }

   @Override
   protected List<GModelProperty> getRootGModelProperties() { return List.of(new GSelectionBorderProperty()); }

   @Override
   protected List<GNotationProperty> getRootGNotationProperties() { return List.of(); }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GNode gmodelRoot) {
      var root = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      root.addAll(List.of(createHeader(root)));

      return root;
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> container) {
      var nameLabelOptions = GCNameLabel.Options.builder()
         .label(origin.getName())
         .clearCss()
         .css(BGCoreCSS.TEXT_HIGHLIGHT)
         .build();

      return new GCNameLabel(context, origin, nameLabelOptions);
   }
}

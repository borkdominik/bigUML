/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.region.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Region;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLayoutOptions;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCNodeBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public class GRegionBuilder<TOrigin extends Region> extends GCNodeBuilder<TOrigin> {

   public GRegionBuilder(final GCModelContext context, final TOrigin source, final String type) {
      super(context, source, type);

   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator.getOrCreateId(origin))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new BCLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(BGCoreCSS.NODE)
         .addCssClass(BGCoreCSS.STROKE_DASHED)
         .build();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createHeader(componentRoot), createBody(componentRoot));
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .container(root);

      return new GCNamedElement<>(context, origin, namedElementOptions.build());
   }

   protected GCProvider createBody(final GCModelList<?, ?> root) {
      var list = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withFreeformLayout()
         .build());

      list.addAll(providersOf(origin.getSubvertices()));
      list.addAll(providersOf(origin.getTransitions()));

      return list;
   }

}

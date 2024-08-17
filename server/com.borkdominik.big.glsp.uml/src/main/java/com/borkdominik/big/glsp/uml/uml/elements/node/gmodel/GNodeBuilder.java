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
package com.borkdominik.big.glsp.uml.uml.elements.node.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Node;

import com.borkdominik.big.glsp.server.core.constants.BGQuotationMark;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.utils.StreamUtils;
import com.borkdominik.big.glsp.uml.uml.elements.class_.gmodel.GClassBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public class GNodeBuilder<TOrigin extends Node> extends GClassBuilder<TOrigin> {

   public GNodeBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   public List<Node> nestedNodes() {
      return this.origin.getNestedNodes();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return StreamUtils.concat(
         super.createComponentChildren(modelRoot, componentRoot),
         List.of(createNodeBody(componentRoot)));
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> container) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .container(container)
         .prefix((BGQuotationMark.quoteDoubleAngle("Node")))
         .build();

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   protected GCProvider createNodeBody(final GCModelList<?, ?> container) {
      var list = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withFreeformLayout()
         .build());

      list.addAll(providersOf(nestedNodes()));
      list.addAll(providersOf(nestedClassifiers()));

      return list;
   }
}

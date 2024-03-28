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
package com.borkdominik.big.glsp.uml.uml.elements.actor.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Actor;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelElement;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLayoutOptions;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCNodeBuilder;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public final class GActorBuilder<TOrigin extends Actor> extends GCNodeBuilder<TOrigin> {

   public GActorBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GNode gmodelRoot) {
      var componentRoot = new GCModelList<>(context, origin,
         new BCCompartmentBuilder<>(origin, context)
            .withRootComponentLayout()
            .addLayoutOptions(new BCLayoutOptions().hAlign(GConstants.HAlign.CENTER).vGap(5))
            .build());

      componentRoot.addAll(createComponentChildren(gmodelRoot, componentRoot));

      return componentRoot;
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode gmodelRoot, final GCModelList<?, ?> root) {
      var figure = new GCModelElement<>(context, origin, new GNodeBuilder(
         UMLTypes.ACTOR_STICKFIGURE.prefix(context.representation()))
            .id(context.idCountGenerator.getOrCreateId(origin))
            .addCssClass(BGCoreCSS.NODE)
            .build());

      var namedElementOptions = GCNamedElement.Options.builder()
         .container(root)
         .build();

      var name = new GCNamedElement<>(context, origin, namedElementOptions);

      return List.of(figure, name);
   }
}

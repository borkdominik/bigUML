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
package com.borkdominik.big.glsp.uml.uml.elements.interaction.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.utils.StreamUtils;
import com.borkdominik.big.glsp.uml.uml.elements.class_.gmodel.GClassBuilder;

public final class GInteractionBuilder<TOrigin extends Interaction> extends GClassBuilder<TOrigin> {

   public GInteractionBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   public List<Lifeline> lifelines() {
      return origin.getLifelines();
   }

   public List<Message> messages() {
      return origin.getMessages();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return StreamUtils.concat(
         super.createComponentChildren(modelRoot, componentRoot),
         List.of(createInteractionBody(componentRoot)));
   }

   protected GCProvider createInteractionBody(final GCModelList<?, ?> container) {
      var list = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withFreeformLayout()
         .build());

      list.addAll(providersOf(lifelines()));
      list.addAll(providersOf(messages()));

      return list;
   }
}

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
package com.borkdominik.big.glsp.uml.uml.elements.instance_specification.gmodel;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Slot;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCNodeBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.components.list.GCList;
import com.borkdominik.big.glsp.server.sdk.ui.components.list.GCListItem;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public class GInstanceSpecificationBuilder<TOrigin extends InstanceSpecification>
   extends GCNodeBuilder<TOrigin> {

   public GInstanceSpecificationBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   public List<Slot> slots() {
      return origin.getSlots();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createHeader(componentRoot), createBody(componentRoot));
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var name = origin.getClassifiers().size() == 0 ? origin.getName()
         : String.format("%s : %s", origin.getName(),
            String.join(",",
               origin.getClassifiers().stream()
                  .map(c -> c.getName()).collect(Collectors.toList())));

      var namedElementOptions = GCNamedElement.Options.builder()
         .container(root)
         .name(Optional.of(name))
         .nameCss(BGCoreCSS.TEXT_UNDERLINE)
         .build();

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   protected GCProvider createBody(final GCModelList<?, ?> root) {
      var options = GCList.Options.builder()
         .dividerBeforeInserts(true)
         .build();
      var list = new GCList(context, origin, options);

      list.addAll(slots().stream()
         .map(e -> context.mapHandler.handle(e))
         .map(e -> new GCListItem(context, origin, e))
         .collect(Collectors.toList()));

      return list;
   }
}

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
package com.eclipsesource.uml.glsp.uml.elements.instance_specification.gmodel;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Slot;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCNodeBuilder;
import com.eclipsesource.uml.glsp.sdk.ui.components.list.GCList;
import com.eclipsesource.uml.glsp.sdk.ui.components.list.GCListItem;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GCNamedElement;

public class GInstanceSpecificationBuilder<TOrigin extends InstanceSpecification>
   extends GCNodeBuilder<TOrigin> {

   public GInstanceSpecificationBuilder(final GModelContext context, final TOrigin origin, final String type) {
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

      var namedElementOptions = new GCNamedElement.Options(root);
      namedElementOptions.name = Optional.of(name);
      namedElementOptions.nameCss.add(CoreCSS.TEXT_UNDERLINE);

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   protected GCProvider createBody(final GCModelList<?, ?> root) {
      var options = new GCList.Options();
      options.dividerBeforeInserts = true;
      var list = new GCList(context, origin, options);

      list.addAll(slots().stream()
         .map(e -> context.gmodelMapHandler().handle(e))
         .map(e -> new GCListItem(context, origin, e))
         .collect(Collectors.toList()));

      return list;
   }
}

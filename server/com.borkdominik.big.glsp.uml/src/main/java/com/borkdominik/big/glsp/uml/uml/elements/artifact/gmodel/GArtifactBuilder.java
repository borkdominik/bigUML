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
package com.borkdominik.big.glsp.uml.uml.elements.artifact.gmodel;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Artifact;

import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCNodeBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.components.list.GCList;
import com.borkdominik.big.glsp.uml.uml.elements.attribute_owner.GCAttributeOwner;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;
import com.borkdominik.big.glsp.uml.uml.elements.operation_owner.GCOperationOwner;

public class GArtifactBuilder<TOrigin extends Artifact> extends GCNodeBuilder<TOrigin> {

   protected final GCOperationOwner<TOrigin> operationOwner;
   protected final GCAttributeOwner<TOrigin> attributeOwner;

   public GArtifactBuilder(final GCModelContext context, final TOrigin source, final String type) {
      super(context, source, type);
      this.operationOwner = new GCOperationOwner<>(context, source);
      this.attributeOwner = new GCAttributeOwner<>(context, source);
   }

   protected List<Artifact> nestedArtifacts() {
      return origin.getNestedArtifacts();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createHeader(componentRoot), createBody(componentRoot), createBody2(componentRoot));
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .prefix("<<Artifact>>")
         .container(root);

      return new GCNamedElement<>(context, origin, namedElementOptions.build());
   }

   protected GCProvider createBody(final GCModelList<?, ?> root) {
      var options = GCList.Options.builder()
         .dividerBeforeInserts(true)
         .build();
      var list = new GCList(context, origin, options);

      list.add(attributeOwner);
      list.add(operationOwner);

      return list;
   }

   protected GCProvider createBody2(final GCModelList<?, ?> root) {
      var list = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withFreeformLayout()
         .build());

      list.addAllGModels(nestedArtifacts().stream()
         .map(e -> context.mapHandler.handle(e))
         .collect(Collectors.toList()));
      list.addAllGModels(nestedArtifacts().stream()
         .map(e -> context.mapHandler.handleSiblings(e))
         .flatMap(Collection::stream)
         .collect(Collectors.toList()));

      return list;

   }

}

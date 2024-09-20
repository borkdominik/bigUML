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
package com.borkdominik.big.glsp.uml.uml.elements.class_.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Classifier;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCNodeBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.components.list.GCList;
import com.borkdominik.big.glsp.uml.uml.elements.attribute_owner.GCAttributeOwner;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;
import com.borkdominik.big.glsp.uml.uml.elements.operation_owner.GCOperationOwner;

public class GClassBuilder<TOrigin extends Class> extends GCNodeBuilder<TOrigin> {

   protected final GCOperationOwner<TOrigin> operationOwner;
   protected final GCAttributeOwner<TOrigin> attributeOwner;

   public List<Classifier> nestedClassifiers() {
      return this.origin.getNestedClassifiers();
   }

   public GClassBuilder(final GCModelContext context, final TOrigin source, final String type) {
      super(context, source, type);
      this.operationOwner = new GCOperationOwner<>(context, source);
      this.attributeOwner = new GCAttributeOwner<>(context, source);
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createHeader(componentRoot), createClassBody(componentRoot));
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .container(root);

      if (origin.isAbstract()) {
         namedElementOptions.nameCss(BGCoreCSS.FONT_ITALIC);
      }

      return new GCNamedElement<>(context, origin, namedElementOptions.build());
   }

   protected GCProvider createClassBody(final GCModelList<?, ?> root) {
      var options = GCList.Options.builder()
         .dividerBeforeInserts(true)
         .build();
      var list = new GCList(context, origin, options);

      list.add(attributeOwner);
      list.add(operationOwner);

      return list;
   }
}

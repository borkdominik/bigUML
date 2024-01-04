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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCNodeBuilder;
import com.eclipsesource.uml.glsp.sdk.ui.components.list.GCList;
import com.eclipsesource.uml.glsp.uml.elements.attribute_owner.GCAttributeOwner;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GCNamedElement;
import com.eclipsesource.uml.glsp.uml.elements.operation_owner.GCOperationOwner;

public class GClassBuilder<TOrigin extends Class> extends GCNodeBuilder<TOrigin> {

   protected final GCOperationOwner<TOrigin> operationOwner;
   protected final GCAttributeOwner<TOrigin> attributeOwner;

   public GClassBuilder(final GModelContext context, final TOrigin source, final String type) {
      super(context, source, type);
      this.operationOwner = new GCOperationOwner<>(context, source);
      this.attributeOwner = new GCAttributeOwner<>(context, source);
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createHeader(componentRoot), createBody(componentRoot));
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var namedElementOptions = new GCNamedElement.Options(root);

      if (origin.isAbstract()) {
         namedElementOptions.nameCss.add(CoreCSS.FONT_ITALIC);
      }

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   protected GCProvider createBody(final GCModelList<?, ?> root) {
      var options = new GCList.Options();
      options.dividerBeforeInserts = true;
      var list = new GCList(context, origin, options);

      list.add(attributeOwner);
      list.add(operationOwner);

      return list;
   }
}

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
package com.borkdominik.big.glsp.uml.uml.elements.operation_owner;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.OperationOwner;

import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCBaseObject;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCBuildable;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCBuildableCollectionProvider;
import com.borkdominik.big.glsp.server.sdk.ui.components.list.GCListItem;

public class GCOperationOwner<TSource extends EObject & OperationOwner> extends GCBaseObject<TSource>
   implements GCBuildableCollectionProvider<GModelElement> {

   public GCOperationOwner(final GCModelContext context, final TSource source) {
      super(context, source);
   }

   public EList<Operation> operations() {
      return origin.getOwnedOperations();
   }

   @Override
   public boolean isVisible() { return operations().size() > 0; }

   @Override
   public Collection<? extends GCBuildable<GModelElement>> provideAll() {
      var operations = operations();

      if (operations.size() > 0) {
         return operations.stream()
            .map(e -> context.mapHandler.handle(e))
            .map(e -> new GCListItem(context, origin, e))
            .collect(Collectors.toList());
      }

      return List.of();
   }
}

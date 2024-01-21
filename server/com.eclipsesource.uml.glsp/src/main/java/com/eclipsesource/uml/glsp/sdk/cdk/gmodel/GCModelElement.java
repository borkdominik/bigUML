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
package com.eclipsesource.uml.glsp.sdk.cdk.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;

public class GCModelElement<TSource extends EObject, TGModel extends GModelElement>
   extends GModelComponent<TSource, TGModel> {

   public GCModelElement(final GModelContext context, final TSource source) {
      this(context, source, null);
   }

   public GCModelElement(final GModelContext context, final TSource source, final TGModel element) {
      super(context, source, element);
   }

   @Override
   public boolean isVisible() { return true; }

   @Override
   protected void extendGModel(final GModelElement gmodel) {

   }
}

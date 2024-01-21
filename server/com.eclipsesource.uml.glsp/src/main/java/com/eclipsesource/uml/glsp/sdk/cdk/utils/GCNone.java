/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.sdk.cdk.utils;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBaseObject;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBuildable;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;

public class GCNone extends GCBaseObject<EObject> implements GCBuildable<GModelElement> {

   public GCNone(final GModelContext context, final EObject source) {
      super(context, source);
   }

   @Override
   public boolean isVisible() { return false; }

   @Override
   public GModelElement provideGModel() {
      return new UmlGLabelBuilder<>(origin, context)
         .text("This should not be visible")
         .build();
   }

}

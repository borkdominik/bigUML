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
package com.eclipsesource.uml.glsp.sdk.cdk.gmodel;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBaseObject;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBuildable;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCIdentifiable;

public abstract class GModelComponent<TSource extends EObject, TGModel extends GModelElement>
   extends GCBaseObject<TSource> implements GCBuildable<TGModel> {
   protected TGModel rootGModel;

   public GModelComponent(final GModelContext context, final TSource source) {
      super(context, source);
   }

   public GModelComponent(final GModelContext context, final TSource source, final TGModel rootGModel) {
      super(context, source);

      this.rootGModel = rootGModel;
   }

   public TGModel getRootGModel() { return rootGModel; }

   public void setRootGModel(final TGModel rootGModel) { this.rootGModel = rootGModel; }

   /**
    * If the rootGModel already exists, then this method will do nothing.
    *
    * @return
    */
   protected Optional<TGModel> createRootGModel() {
      return Optional.empty();
   }

   @Override
   public TGModel provideGModel() {
      var root = this.rootGModel != null ? this.rootGModel : this.createRootGModel().orElseGet(null);
      if (root == null) {
         throw new IllegalStateException("rootGModel was null. Did you provide it?");
      }
      this.rootGModel = root;

      if (this instanceof GCIdentifiable) {
         var id = (GCIdentifiable) this;
         root.getCssClasses().add(id.getIdentifier());
      }

      extendGModel(root);

      return this.rootGModel;
   }

   protected abstract void extendGModel(GModelElement gmodel);
}

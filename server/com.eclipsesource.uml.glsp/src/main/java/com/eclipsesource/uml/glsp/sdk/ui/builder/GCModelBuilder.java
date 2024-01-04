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
package com.eclipsesource.uml.glsp.sdk.ui.builder;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBaseObject;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GModelProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GNotationProperty;

public abstract class GCModelBuilder<TOrigin extends EObject, TElement extends GModelElement>
   extends GCBaseObject<TOrigin> {

   public GCModelBuilder(final GModelContext context, final TOrigin origin) {
      super(context, origin);
   }

   protected List<GModelProperty> getRootGModelProperties() { return List.of(); }

   protected List<GNotationProperty> getRootGNotationProperties() { return List.of(); }

   protected abstract TElement createRootGModel();

   protected abstract GCModelList<?, ?> createRootComponent(TElement gmodelRoot);

   public TElement buildGModel() {
      var gmodelRoot = createRootGModel();
      getRootGModelProperties().forEach(p -> p.assign(gmodelRoot));
      getRootGNotationProperties().forEach(p -> p.assign(origin, gmodelRoot));

      gmodelRoot.getChildren().add(createRootComponent(gmodelRoot).provideGModel());

      return gmodelRoot;
   }
}

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
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GBendingPointProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GNotationProperty;

public abstract class GCEdgeBuilder<TOrigin extends EObject>
   extends GCModelBuilder<TOrigin, GEdge> {

   protected final String type;

   public GCEdgeBuilder(final GModelContext context, final TOrigin source, final String type) {
      super(context, source);

      this.type = type;
   }

   public String sourceId() {
      return context.idGenerator().getOrCreateId(source());
   }

   public String targetId() {
      return context.idGenerator().getOrCreateId(target());
   }

   public abstract EObject source();

   public abstract EObject target();

   @Override
   protected GEdge createRootGModel() {
      return new GEdgeBuilder(type)
         .id(context.idGenerator().getOrCreateId(origin))
         .addCssClass(CoreCSS.EDGE)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .addArgument(GArguments.edgePadding(10))
         .sourceId(sourceId())
         .targetId(targetId())
         .build();
   }

   @Override
   protected List<GNotationProperty> getRootGNotationProperties() {
      return List.of(new GBendingPointProperty(context));
   }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GEdge gmodelRoot) {
      var componentRoot = new GCModelList<>(context, origin, gmodelRoot);

      componentRoot.addAll(createComponentChildren(gmodelRoot, componentRoot));

      return componentRoot;
   }

   protected abstract List<GCProvider> createComponentChildren(GEdge gmodelRoot, GCModelList<?, ?> componentRoot);
}

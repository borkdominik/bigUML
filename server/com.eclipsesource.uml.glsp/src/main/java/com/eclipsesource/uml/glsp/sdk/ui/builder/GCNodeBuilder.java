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
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GBorderProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GModelProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GNotationProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GPositionProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GSizeProperty;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;

public abstract class GCNodeBuilder<TOrigin extends EObject>
   extends GCModelBuilder<TOrigin, GNode> {

   protected final String type;

   public GCNodeBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin);
      this.type = type;
   }

   @Override
   protected List<GModelProperty> getRootGModelProperties() { return List.of(new GBorderProperty()); }

   @Override
   protected List<GNotationProperty> getRootGNotationProperties() {
      return List.of(new GPositionProperty(context), new GSizeProperty(context));
   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator().getOrCreateId(origin))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new UmlGLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(CoreCSS.NODE)
         .build();
   }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GNode gmodelRoot) {
      var componentRoot = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withRootComponentLayout()
         .build());

      componentRoot.addAll(createComponentChildren(gmodelRoot, componentRoot));

      return componentRoot;
   }

   protected abstract List<GCProvider> createComponentChildren(GNode gmodelRoot, GCModelList<?, ?> root);
}

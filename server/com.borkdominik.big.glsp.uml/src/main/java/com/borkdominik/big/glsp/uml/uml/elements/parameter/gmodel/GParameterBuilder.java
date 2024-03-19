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
package com.borkdominik.big.glsp.uml.uml.elements.parameter.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLabelBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLayoutOptions;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCModelBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GModelProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GNotationProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GSelectionBorderProperty;
import com.borkdominik.big.glsp.uml.uml.elements.parameter.utils.ParameterPropertyPaletteUtils;
import com.borkdominik.big.glsp.uml.uml.elements.type.TypeUtils;

public class GParameterBuilder<TOrigin extends Parameter>
   extends GCModelBuilder<TOrigin, GNode> {
   protected final String type;

   public GParameterBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin);

      this.type = type;
   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator.getOrCreateId(origin))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new BCLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(BGCoreCSS.NODE)
         .build();
   }

   @Override
   protected List<GModelProperty> getRootGModelProperties() { return List.of(new GSelectionBorderProperty()); }

   @Override
   protected List<GNotationProperty> getRootGNotationProperties() { return List.of(); }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GNode modelRoot) {
      var root = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      root.add(createLabel(origin));

      return root;
   }

   protected GModelElement createLabel(final Parameter source) {
      if (source.getDirection() == ParameterDirectionKind.RETURN_LITERAL) {
         return asReturnParameter(source);
      }

      return asParameter(source);
   }

   protected GModelElement asParameter(final Parameter source) {
      return new BCLabelBuilder(source, context)
         .text(ParameterPropertyPaletteUtils.asText(source))
         .addCssClass(BGCoreCSS.TEXT_INTERACTABLE)
         .build();
   }

   protected GModelElement asReturnParameter(final Parameter source) {
      return new BCLabelBuilder(source, context)
         .text(String.format("%s", TypeUtils.asText(source.getType(), source)))
         .addCssClass(BGCoreCSS.TEXT_INTERACTABLE)
         .build();
   }
}

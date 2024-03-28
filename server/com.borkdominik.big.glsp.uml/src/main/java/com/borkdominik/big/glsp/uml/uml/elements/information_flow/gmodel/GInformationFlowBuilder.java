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
package com.borkdominik.big.glsp.uml.uml.elements.information_flow.gmodel;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.InformationFlow;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.core.constants.BGQuotationMark;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCEdgeBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.components.label.GCNameLabel;
import com.borkdominik.big.glsp.server.sdk.utils.StreamUtils;

public class GInformationFlowBuilder<TOrigin extends InformationFlow> extends GCEdgeBuilder<TOrigin> {

   public GInformationFlowBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   public EObject source() {
      return origin.getInformationSources().get(0);
   }

   @Override
   public EObject target() {
      return origin.getInformationTargets().get(0);
   }

   @Override
   protected List<String> getRootGModelCss() {
      return StreamUtils.concat(super.getDefaultCss(), List.of(BGCoreCSS.EDGE_DASHED, BGCoreCSS.Marker.TENT.end()));
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GEdge gmodelRoot, final GCModelList<?, ?> componentRoot) {
      var nameLabelOptions = GCNameLabel.Options.builder()
         .label(origin.getName())
         .clearCss()
         .css(BGCoreCSS.TEXT_HIGHLIGHT)
         .edgePlacement(new GEdgePlacementBuilder()
            .side(GConstants.EdgeSide.BOTTOM)
            .position(0.5d)
            .offset(10d)
            .rotate(true)
            .build())
         .build();

      var nameLabel = new GCNameLabel(context, origin, nameLabelOptions);

      return List.of(createCenteredLabel(BGQuotationMark.quoteDoubleAngle("flow")), nameLabel);
   }

}

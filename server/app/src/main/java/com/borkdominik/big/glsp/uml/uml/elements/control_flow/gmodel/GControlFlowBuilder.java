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
package com.borkdominik.big.glsp.uml.uml.elements.control_flow.gmodel;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.ControlFlow;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCEdgeBuilder;
import com.borkdominik.big.glsp.server.sdk.utils.StreamUtils;

public class GControlFlowBuilder<TOrigin extends ControlFlow> extends GCEdgeBuilder<TOrigin> {

   public GControlFlowBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   public EObject source() {
      return this.origin.getSource();
   }

   @Override
   public EObject target() {
      return this.origin.getTarget();
   }

   @Override
   protected List<String> getRootGModelCss() {
      return StreamUtils.concat(super.getDefaultCss(), List.of(BGCoreCSS.Marker.TENT.end()));
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GEdge gmodelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of();
   }

   /*-

   private GModelElement createWeightLabel(final ValueSpecification weight, final String edgeId) {
      var edgePlacement = new GEdgePlacementBuilder().side(GConstants.EdgeSide.TOP).position(0.5d).rotate(true)
         .offset(10d)
         .build();
      var labelId = suffix.appendTo(WeightLabelSuffix.SUFFIX, edgeId);
   
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .edgePlacement(edgePlacement)
         .id(labelId)
         .text("{weight=" + weight.integerValue() + "}")
         .build();
   }
   
   private GLabel createGuardLabel(final ValueSpecification valueSpecification, final String edgeId) {
      var edgePlacement = new GEdgePlacementBuilder().side(GConstants.EdgeSide.BOTTOM).position(0.5d).rotate(true)
         .offset(10d)
         .build();
      var labelId = suffix.appendTo(GuardLabelSuffix.SUFFIX, edgeId);
   
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .edgePlacement(edgePlacement)
         .id(labelId)
         .text("[" + valueSpecification.stringValue() + "]")
         .build();
   }
    */
}

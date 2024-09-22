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
package com.borkdominik.big.glsp.uml.uml.elements.substitution.gmodel;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Substitution;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.core.constants.BGQuotationMark;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.utils.StreamUtils;
import com.borkdominik.big.glsp.uml.uml.elements.realization.gmodel.GRealizationBuilder;

public class GSubstitutionBuilder<TOrigin extends Substitution> extends GRealizationBuilder<TOrigin> {

   public GSubstitutionBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   public EObject source() {
      return substitutingClassifier();
   }

   public Classifier substitutingClassifier() {
      return origin.getSubstitutingClassifier();
   }

   @Override
   public EObject target() {
      return contract();
   }

   public Classifier contract() {
      return origin.getContract();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GEdge gmodelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createCenteredLabel(BGQuotationMark.quoteDoubleAngle("substitution")));
   }

   @Override
   protected List<String> getRootGModelCss() {
      return StreamUtils.concat(super.getDefaultCss(),
         List.of(BGCoreCSS.EDGE_DASHED, BGCoreCSS.Marker.TENT.end()));
   }
}

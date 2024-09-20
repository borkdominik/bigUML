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
package com.borkdominik.big.glsp.uml.uml.elements.deployment.gmodel;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.DeployedArtifact;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentTarget;

import com.borkdominik.big.glsp.server.core.constants.BGQuotationMark;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.utils.StreamUtils;
import com.borkdominik.big.glsp.uml.uml.elements.dependency.gmodel.GDependencyBuilder;

public class GDeploymentBuilder<TOrigin extends Deployment> extends GDependencyBuilder<TOrigin> {

   public GDeploymentBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   public EObject source() {
      return deployedArtifacts().get(0);
   }

   public List<DeployedArtifact> deployedArtifacts() {
      return origin.getDeployedArtifacts();
   }

   @Override
   public EObject target() {
      return location();
   }

   public DeploymentTarget location() {
      return origin.getLocation();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GEdge modelRoot, final GCModelList<?, ?> componentRoot) {
      return StreamUtils.concat(
         super.createComponentChildren(modelRoot, componentRoot),
         List.of(createCenteredLabel(BGQuotationMark.quoteDoubleAngle("deploy"))));
   }
}

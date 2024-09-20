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
package com.borkdominik.big.glsp.uml.uml.elements.deployment_specification.gmodel;

import org.eclipse.uml2.uml.DeploymentSpecification;

import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.uml.uml.elements.artifact.gmodel.GArtifactBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public final class GDeploymentSpecificationBuilder<TOrigin extends DeploymentSpecification>
   extends GArtifactBuilder<TOrigin> {

   public GDeploymentSpecificationBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .prefix("<<Deployment Specification>>")
         .container(root);

      return new GCNamedElement<>(context, origin, namedElementOptions.build());
   }

}

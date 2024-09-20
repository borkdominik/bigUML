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
package com.borkdominik.big.glsp.uml.uml.elements.communication_path.gmodel;

import org.eclipse.uml2.uml.CommunicationPath;

import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.uml.uml.elements.association.gmodel.GAssociationBuilder;

public class GCommunicationPathBuilder<TOrigin extends CommunicationPath> extends GAssociationBuilder<TOrigin> {

   public GCommunicationPathBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

}

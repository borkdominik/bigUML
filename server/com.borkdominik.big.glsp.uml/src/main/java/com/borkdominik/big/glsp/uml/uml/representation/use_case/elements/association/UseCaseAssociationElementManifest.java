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
package com.borkdominik.big.glsp.uml.uml.representation.use_case.elements.association;

import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.uml.uml.elements.association.AssociationElementManifest;

public class UseCaseAssociationElementManifest extends AssociationElementManifest {
   public UseCaseAssociationElementManifest(final BGRepresentationManifest manifest) {
      super(manifest);
   }

   @Override
   protected void configureElement() {
      super.configureElement();

      bindGModelMapper(UseCaseAssociationGModelMapper.class);
   }
}

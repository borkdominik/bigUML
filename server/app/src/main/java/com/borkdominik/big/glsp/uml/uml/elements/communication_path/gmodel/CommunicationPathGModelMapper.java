/********************************************************************************
 * Copyright (c) 2021 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.communication_path.gmodel;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.CommunicationPath;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.gmodel.BGEMFElementGModelMapper;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class CommunicationPathGModelMapper extends BGEMFElementGModelMapper<CommunicationPath, GEdge> {

   @Inject
   public CommunicationPathGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public GEdge map(final CommunicationPath source) {
      return new GCommunicationPathBuilder<>(gcmodelContext, source, UMLTypes.COMMUNICATION_PATH.prefix(representation))
         .buildGModel();
   }
}

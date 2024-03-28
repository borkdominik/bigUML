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
package com.borkdominik.big.glsp.uml.uml.representation.use_case.elements.association;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.Association;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.association.gmodel.AssociationGModelMapper;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class UseCaseAssociationGModelMapper extends AssociationGModelMapper {

   @Inject
   public UseCaseAssociationGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public GEdge map(final Association source) {
      return new UseCaseGAssociationBuilder<>(gcmodelContext, source, UMLTypes.ASSOCIATION.prefix(representation))
         .buildGModel();
   }

}

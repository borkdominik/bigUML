/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.pseudostate.gmodel;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Pseudostate;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.gmodel.BGEMFElementGModelMapper;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PseudostateGModelMapper extends BGEMFElementGModelMapper<Pseudostate, GNode> {

   @Inject
   public PseudostateGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public GNode map(final Pseudostate source) {
      String typeId;

      switch (source.getKind()) {
         case CHOICE_LITERAL:
            typeId = UMLTypes.CHOICE.prefix(representation);
            break;
         case DEEP_HISTORY_LITERAL:
            typeId = UMLTypes.DEEP_HISTORY.prefix(representation);
            break;
         case FORK_LITERAL:
            typeId = UMLTypes.FORK.prefix(representation);
            break;
         case INITIAL_LITERAL:
            typeId = UMLTypes.INITIAL_STATE.prefix(representation);
            break;
         case JOIN_LITERAL:
            typeId = UMLTypes.JOIN.prefix(representation);
            break;
         case SHALLOW_HISTORY_LITERAL:
            typeId = UMLTypes.SHALLOW_HISTORY.prefix(representation);
            break;
         default:
            typeId = UMLTypes.PSEUDOSTATE.prefix(representation);
            break;
      }

      return new GPseudoStateBuilder<>(gcmodelContext, source, typeId)
         .buildGModel();
   }

}

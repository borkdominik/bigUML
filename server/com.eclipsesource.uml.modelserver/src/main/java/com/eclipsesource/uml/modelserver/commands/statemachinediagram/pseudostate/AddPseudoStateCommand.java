/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.pseudostate;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

import java.util.List;

public class AddPseudoStateCommand extends UmlSemanticElementCommand {

   protected final Pseudostate newPseudostate;

   protected final Region containerRegion;

   protected final PseudostateKind pseudoStateKind;

   public AddPseudoStateCommand(final EditingDomain domain, final URI modelUri,
                                final String containerRegionUriFragment, final PseudostateKind pseudoStateKind) {
      super(domain, modelUri);
      this.newPseudostate = UMLFactory.eINSTANCE.createPseudostate();
      this.pseudoStateKind = pseudoStateKind;
      this.containerRegion = UmlSemanticCommandUtil.getElement(umlModel, containerRegionUriFragment, Region.class);
   }

   @Override
   protected void doExecute() {
      newPseudostate.setName(UmlSemanticCommandUtil.getNewVertexName(containerRegion));
      newPseudostate.setKind(this.pseudoStateKind);
      if (List.of(PseudostateKind.ENTRY_POINT_LITERAL, PseudostateKind.EXIT_POINT_LITERAL)
         .contains(newPseudostate.getKind())) {
         EObject container = containerRegion.eContainer();
         if (container instanceof State) {
            ((State) container).getConnectionPoints().add(newPseudostate);
         } else if (container instanceof StateMachine) {
            ((StateMachine) container).getConnectionPoints().add(newPseudostate);
         }
      } else {
         containerRegion.getSubvertices().add(newPseudostate);
      }
   }

   public Pseudostate getNewPseudostate() { return newPseudostate; }

}

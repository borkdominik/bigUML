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
package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.pseudostate;

public class AddPseudoStateCommand { /*- {

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
      containerRegion.getSubvertices().add(newPseudostate);

      EObject container = containerRegion.eContainer();

      // TODO: check if this distinction is even needed!
      /*if (newPseudostate.getKind() == PseudostateKind.ENTRY_POINT_LITERAL || newPseudostate.getKind() == PseudostateKind.EXIT_POINT_LITERAL) {
         if (container instanceof State) {
            ((State) container).getConnectionPoints().add(newPseudostate);
         } else {
            //((StateMachine) container).getConnectionPoints().add(newPseudostate);
            containerRegion.getSubvertices().add(newPseudostate);
         }
      } else {
         containerRegion.getSubvertices().add(newPseudostate);
      }*/

   // if (newPseudostate.getKind() == PseudostateKind.ENTRY_POINT_LITERAL || newPseudostate.getKind() ==
   // PseudostateKind.EXIT_POINT_LITERAL) {
   // }
   /*
    * if (List.of(PseudostateKind.ENTRY_POINT_LITERAL, PseudostateKind.EXIT_POINT_LITERAL)
    * .contains(newPseudostate.getKind())) {
    * EObject container = containerRegion.eContainer();
    * System.out.println("CONTAINER " + container.getClass());
    * if (container instanceof State) {
    * ((State) container).getConnectionPoints().add(newPseudostate);
    * } else if (container instanceof StateMachine) {
    * ((StateMachine) container).getConnectionPoints().add(newPseudostate);
    * }
    * } else {
    * containerRegion.getSubvertices().add(newPseudostate);
    * }
    * }
    * public Pseudostate getNewPseudostate() { return newPseudostate; }
    */
}

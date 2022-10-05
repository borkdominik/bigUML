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

public class RemovePseudoStateCommand { /*- {

   protected final String parentSemanticUriFragment;
   protected final String semanticUriFragment;

   public RemovePseudoStateCommand(final EditingDomain domain, final URI modelUri,
                                   final String parentSemanticUriFragment,
                                   final String semanticUriFragment) {
      super(domain, modelUri);
      this.parentSemanticUriFragment = parentSemanticUriFragment;
      this.semanticUriFragment = semanticUriFragment;
   }

   @Override
   protected void doExecute() {
      Pseudostate pseudostateToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
         Pseudostate.class);
      if (List.of(PseudostateKind.ENTRY_POINT_LITERAL, PseudostateKind.EXIT_POINT_LITERAL)
         .contains(pseudostateToRemove.getKind())) {
         EObject container = pseudostateToRemove.eContainer();
         if (container instanceof State) {
            StateMachine parentStateMachine = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment,
               StateMachine.class);
            parentStateMachine.getConnectionPoints().remove(pseudostateToRemove);
         } else if (container instanceof StateMachine) {
            StateMachine parentStateMachine = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment,
               StateMachine.class);
            parentStateMachine.getConnectionPoints().remove(pseudostateToRemove);
         }
      } else {
         Region parentRegion = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Region.class);
         parentRegion.getSubvertices().remove(pseudostateToRemove);
      }
   }   */

}

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
package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.statemachine.region;

public class RemoveRegionCommand { /*- {

   protected final String semanticUriFragment;

   public RemoveRegionCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
   }

   @Override
   protected void doExecute() {
      var regionToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Region.class);
      var container = regionToRemove.eContainer();

      if (container instanceof StateMachine) {
         ((StateMachine) container).getRegions().remove(regionToRemove);
      } else if (container instanceof State) {
         ((State) container).getRegions().remove(regionToRemove);
      }
   }
   */
}

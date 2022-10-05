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
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine;

public class RemoveStateMachineCompoundCommand { /*-{

   public RemoveStateMachineCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String semanticUriFragment) {

      var umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      var stateMachineToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
         StateMachine.class);

      for (Region region : stateMachineToRemove.getRegions()) {
         var regionUri = UmlSemanticCommandUtil.getSemanticUriFragment(region);
         this.append(new RemoveRegionCompoundCommand(domain, modelUri, regionUri));
      }

      this.append(new RemoveStateMachineCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveStateMachineShapeCommand(domain, modelUri, semanticUriFragment));
   }
   */
}

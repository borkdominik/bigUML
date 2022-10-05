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
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine.region;

public class RemoveRegionCompoundCommand { /*-{

   public RemoveRegionCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String semanticUriFragment) {

      var umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      var regionToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Region.class);

      var usagesRegion = UsageCrossReferencer.find(regionToRemove, umlModel.eResource());
      for (Setting setting : usagesRegion) {
         var eObject = setting.getEObject();

         if (eObject instanceof Pseudostate) {
            var pseudostateUri = UmlSemanticCommandUtil.getSemanticUriFragment((Pseudostate) eObject);
            this.append(
               new RemovePseudoStateCompoundCommand(domain, modelUri, semanticUriFragment, pseudostateUri));
         } /*else if (eObject instanceof FinalState) {
            var finalStateUri = UmlSemanticCommandUtil.getSemanticUriFragment((FinalState) eObject);
            this.append(
               new RemoveFinalStateCompoundCommand(domain, modelUri, semanticUriFragment, finalStateUri));
         }* else if (eObject instanceof State) {
            var stateUri = UmlSemanticCommandUtil.getSemanticUriFragment((State) eObject);
            this.append(
               new RemoveStateCompoundCommand(domain, modelUri, semanticUriFragment, stateUri));
         }
      }

this.append(new RemoveRegionCommand(domain,modelUri,semanticUriFragment));}
   */
}

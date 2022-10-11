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

public class RemovePseudoStateCompoundCommand { /*-{

   public RemovePseudoStateCompoundCommand(final EditingDomain domain, final URI modelUri,
                                           final String parentSemanticUriFragment, final String semanticUriFragment) {
      this.append(new RemovePseudoStateCommand(domain, modelUri, parentSemanticUriFragment, semanticUriFragment));
      this.append(new RemovePseudoStateShapeCommand(domain, modelUri, semanticUriFragment));

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      Pseudostate pseudostateToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
         Pseudostate.class);

      Collection<Setting> usagesPseudostate = UsageCrossReferencer.find(pseudostateToRemove, umlModel.eResource());
      for (Setting setting : usagesPseudostate) {
         EObject eObject = setting.getEObject();

         if (eObject instanceof Transition) {
            String transitionUri = UmlSemanticCommandUtil.getSemanticUriFragment((Transition) eObject);
            this.append(
               new RemoveTransitionCompoundCommand(domain, modelUri, parentSemanticUriFragment, transitionUri));
         }
      }
   }
   */
}

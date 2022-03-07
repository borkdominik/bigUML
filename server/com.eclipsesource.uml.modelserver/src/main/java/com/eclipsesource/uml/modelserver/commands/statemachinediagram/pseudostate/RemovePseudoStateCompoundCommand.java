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

import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Pseudostate;

public class RemovePseudoStateCompoundCommand extends CompoundCommand {

   public RemovePseudoStateCompoundCommand(final EditingDomain domain, final URI modelUri,
                                           final String parentSemanticUriFragment, final String semanticUriFragment) {
      this.append(new RemovePseudoStateCommand(domain, modelUri, parentSemanticUriFragment, semanticUriFragment));
      this.append(new RemovePseudoStateShapeCommand(domain, modelUri, semanticUriFragment));

      var umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      var pseudostateToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
         Pseudostate.class);

      var usagesPseudostate = UsageCrossReferencer.find(pseudostateToRemove, umlModel.eResource());
      for (Setting setting : usagesPseudostate) {
         var eObject = setting.getEObject();

         //TODO
         /*if (eObject instanceof Transition) {
            var transitionUri = UmlSemanticCommandUtil.getSemanticUriFragment((Transition) eObject);
            this.append(
               new RemoveTransitionCompoundCommand(domain, modelUri, parentSemanticUriFragment, transitionUri));
         }*/
      }
   }

}

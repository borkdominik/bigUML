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
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.state;

import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.RemoveTransitionCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.Transition;

import java.util.Collection;

public class RemoveStateCompoundCommand extends CompoundCommand {

   public RemoveStateCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String parentSemanticUriFragment, final String semanticUriFragment) {
      this.append(new RemoveStateCommand(domain, modelUri, parentSemanticUriFragment, semanticUriFragment));
      this.append(new RemoveStateShapeCommand(domain, modelUri, semanticUriFragment));

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      State stateToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, State.class);

      Collection<Setting> usagesStateMachine = UsageCrossReferencer.find(stateToRemove, umlModel.eResource());
      for (Setting setting : usagesStateMachine) {
         EObject eObject = setting.getEObject();


         if (eObject instanceof Transition) {
            String transitionUri = UmlSemanticCommandUtil.getSemanticUriFragment((Transition) eObject);
            this.append(
               new RemoveTransitionCompoundCommand(domain, modelUri, parentSemanticUriFragment, transitionUri));
         }
      }
   }

}

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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.action;

public class SetBehaviorCommand { /*-

   protected String semanticUriFragment;
   protected String behaviorName;

   public SetBehaviorCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
      final String behaviorName) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
      this.behaviorName = behaviorName;
   }

   @Override
   protected void doExecute() {
      CallBehaviorAction cba = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
         CallBehaviorAction.class);
      if (behaviorName == null) {
         cba.setBehavior(null);
         return;
      }

      Model model = cba.containingActivity().getModel();
      Optional<Behavior> result = model.getPackagedElements().stream()
         .filter(Behavior.class::isInstance)
         .map(Behavior.class::cast)
         .filter(b -> b.getName() != null)
         .filter(b -> b.getName().toLowerCase().equals(behaviorName.toLowerCase()))
         .findFirst();
      if (result.isPresent()) {
         cba.setBehavior(result.get());
      }
   }
   */
}

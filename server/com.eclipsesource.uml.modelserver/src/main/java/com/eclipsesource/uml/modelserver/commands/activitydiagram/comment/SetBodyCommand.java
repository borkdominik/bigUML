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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.comment;

public class SetBodyCommand { /*-

   protected String semanticUriFragment;
   protected String newName;

   public SetBodyCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
      final String newName) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      Element element = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Element.class);

      if (element instanceof Comment) {
         ((Comment) element).setBody(newName);
      } else if (element instanceof Constraint) {
         Constraint constraint = (Constraint) element;
         OpaqueExpression exp = (OpaqueExpression) constraint.getSpecification();
         if (newName.trim().isEmpty()) {
            Activity activity = (Activity) constraint.getOwner();
            activity.getOwnedRules().remove(constraint);
         } else {
            exp.getBodies().set(0, newName);
         }
      }
   }
   */
}

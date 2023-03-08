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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.datanode;

public class AddPinCommand { /*-implements Supplier<Pin> {

   private final Action action;
   private Pin pin;

   public AddPinCommand(final EditingDomain domain, final URI modelUri, final String actionUri) {
      super(domain, modelUri);
      action = UmlSemanticCommandUtil.getElement(umlModel, actionUri, Action.class);
   }

   @Override
   protected void doExecute() {
      pin = UMLFactory.eINSTANCE.createInputPin();
      int count = 0;
      if (action instanceof OpaqueAction) {
         count = ((OpaqueAction) action).getInputValues().size();
         ((OpaqueAction) action).getInputValues().add((InputPin) pin);
      } else if (action instanceof InvocationAction) {
         ((InvocationAction) action).getArguments().size();
         ((InvocationAction) action).getArguments().add((InputPin) pin);
      }
      pin.setName("NewPin" + count);
   }

   @Override
   public Pin get() {
      return pin;
   }
   */
}

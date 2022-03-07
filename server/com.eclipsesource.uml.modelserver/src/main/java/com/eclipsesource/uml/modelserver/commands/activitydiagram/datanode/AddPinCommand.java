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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode;

import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Action;
import org.eclipse.uml2.uml.InputPin;
import org.eclipse.uml2.uml.InvocationAction;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.Pin;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddPinCommand extends UmlSemanticElementCommand implements Supplier<Pin> {

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
      } else {
         // TODO: Invalid action type (AcceptEventAction)
      }
      pin.setName("NewPin" + count);
   }

   @Override
   public Pin get() {
      return pin;
   }

}

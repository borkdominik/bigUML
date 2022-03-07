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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.flow;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.LiteralString;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class SetGuardCommand extends UmlSemanticElementCommand {

   protected String semanticUriFragment;
   protected String newValue;

   public SetGuardCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
      final String newValue) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
      this.newValue = newValue;
   }

   @Override
   protected void doExecute() {
      ControlFlow controlFlow = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, ControlFlow.class);
      ((LiteralString) controlFlow.getGuard()).setValue(newValue);
   }

}

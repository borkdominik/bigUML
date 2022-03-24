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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.exceptionhandler;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.ExceptionHandler;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveExceptionHandlerCommand extends UmlSemanticElementCommand {

   private final ExceptionHandler handler;

   public RemoveExceptionHandlerCommand(final EditingDomain domain, final URI modelUri,
      final String semanticUriFragment) {
      super(domain, modelUri);
      handler = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, ExceptionHandler.class);
   }

   @Override
   protected void doExecute() {
      handler.getProtectedNode().getHandlers().remove(handler);
   }

}

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

public class AddExceptionHandlerCommand { /*-implements Supplier<ExceptionHandler> {

   private ExceptionHandler handler;
   protected ExecutableNode source;
   protected Pin targetPin;

   public AddExceptionHandlerCommand(final EditingDomain domain, final URI modelUri,
      final String sourceClassUriFragment, final String targetClassUriFragment) {
      super(domain, modelUri);

      source = UmlSemanticCommandUtil.getElement(umlModel, sourceClassUriFragment, ExecutableNode.class);
      targetPin = UmlSemanticCommandUtil.getElement(umlModel, targetClassUriFragment, Pin.class);

   }

   @Override
   protected void doExecute() {
      handler = UMLFactory.eINSTANCE.createExceptionHandler();
      ExecutableNode handlerBody = (ExecutableNode) targetPin.getOwner();
      source.getHandlers().add(handler);
      handler.setExceptionInput(targetPin);
      handler.setHandlerBody(handlerBody);
      handler.setProtectedNode(source);
   }

   @Override
   public ExceptionHandler get() {
      return handler;
   }
   */
}

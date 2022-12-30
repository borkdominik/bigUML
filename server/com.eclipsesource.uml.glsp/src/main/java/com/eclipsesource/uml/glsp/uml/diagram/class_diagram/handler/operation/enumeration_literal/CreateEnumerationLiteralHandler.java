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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration_literal;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration_literal.AddEnumerationLiteralContribution;

public class CreateEnumerationLiteralHandler
   extends BaseCreateChildNodeHandler<Enumeration> {

   public CreateEnumerationLiteralHandler() {
      super(ClassTypes.ENUMERATION_LITERAL);
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Enumeration parent) {
      return AddEnumerationLiteralContribution.create(parent);
   }

}

/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Enumeration;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.UpdateEnumerationArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.UpdateEnumerationContribution;

public final class UpdateEnumerationHandler extends BaseUpdateElementHandler<Enumeration, UpdateEnumerationArgument> {

   public UpdateEnumerationHandler() {
      super(UmlClass_Enumeration.ID);
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Enumeration element,
      final UpdateEnumerationArgument updateArgument) {
      return UpdateEnumerationContribution.create(element, updateArgument);
   }
}

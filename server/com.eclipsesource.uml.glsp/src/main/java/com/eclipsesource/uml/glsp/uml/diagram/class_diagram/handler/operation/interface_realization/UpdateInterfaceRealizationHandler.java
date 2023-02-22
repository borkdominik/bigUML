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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.interface_realization;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Abstraction;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.interface_realization.UpdateInterfaceRealizationArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.interface_realization.UpdateInterfaceRealizationContribution;

public final class UpdateInterfaceRealizationHandler
   extends BaseUpdateElementHandler<InterfaceRealization, UpdateInterfaceRealizationArgument> {

   public UpdateInterfaceRealizationHandler() {
      super(UmlClass_Abstraction.ID);
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final InterfaceRealization element,
      final UpdateInterfaceRealizationArgument updateArgument) {
      return UpdateInterfaceRealizationContribution.create(element, updateArgument);
   }
}

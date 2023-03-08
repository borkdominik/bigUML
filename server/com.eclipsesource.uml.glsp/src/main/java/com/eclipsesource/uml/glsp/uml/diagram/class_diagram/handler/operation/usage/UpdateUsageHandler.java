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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.usage;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Usage;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.usage.UpdateUsageArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.usage.UpdateUsageContribution;

public final class UpdateUsageHandler
   extends BaseUpdateElementHandler<Usage, UpdateUsageArgument> {

   public UpdateUsageHandler() {
      super(UmlClass_Usage.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Usage element,
      final UpdateUsageArgument updateArgument) {
      return UpdateUsageContribution.create(element, updateArgument);
   }
}

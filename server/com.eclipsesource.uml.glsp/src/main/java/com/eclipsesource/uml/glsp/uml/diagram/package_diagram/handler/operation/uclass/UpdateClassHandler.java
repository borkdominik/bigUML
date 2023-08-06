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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.uclass;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Class;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.uclass.UpdateClassArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.uclass.UpdateClassContribution;

public final class UpdateClassHandler extends BaseUpdateElementHandler<Class, UpdateClassArgument> {

   public UpdateClassHandler() {
      super(UmlPackage_Class.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Class element,
      final UpdateClassArgument updateArgument) {
      return UpdateClassContribution.create(element, updateArgument);
   }
}

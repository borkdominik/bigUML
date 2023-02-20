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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.parameter;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Parameter;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Parameter;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.parameter.UpdateParameterArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.parameter.UpdateParameterContribution;

public final class UpdateParameterHandler extends BaseUpdateElementHandler<Parameter, UpdateParameterArgument> {

   public UpdateParameterHandler() {
      super(UmlClass_Parameter.ID);
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Parameter element,
      final UpdateParameterArgument updateArgument) {
      return UpdateParameterContribution.create(element, updateArgument);
   }
}

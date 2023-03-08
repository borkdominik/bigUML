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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.DataType;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_DataType;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type.UpdateDataTypeArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type.UpdateDataTypeContribution;

public final class UpdateDataTypeHandler extends BaseUpdateElementHandler<DataType, UpdateDataTypeArgument> {

   public UpdateDataTypeHandler() {
      super(UmlClass_DataType.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final DataType element,
      final UpdateDataTypeArgument updateArgument) {
      return UpdateDataTypeContribution.create(element, updateArgument);
   }
}

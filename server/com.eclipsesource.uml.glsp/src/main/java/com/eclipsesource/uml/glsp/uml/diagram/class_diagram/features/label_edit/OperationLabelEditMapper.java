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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit;

import java.util.Optional;

import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.UpdateOperationNameHandler;
import com.eclipsesource.uml.glsp.uml.features.label_edit.BaseLabelEditMapper;

public final class OperationLabelEditMapper extends BaseLabelEditMapper<Operation> {

   @Override
   public Optional<UpdateOperation> map(final ApplyLabelEditOperation operation) {
      return operationBuilder()
         .map(CoreTypes.LABEL_NAME, NameLabelSuffix.SUFFIX,
            (element, op) -> handlerMapper.asOperation(
               UpdateOperationNameHandler.class,
               element,
               new UpdateOperationNameHandler.Args(op.getText())))
         .find(operation);
   }
}

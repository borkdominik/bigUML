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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.primitive_type;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.uml.handler.operations.delete.BaseDeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type.DeletePrimitiveTypeContribution;

public final class DeletePrimitiveTypeHandler extends BaseDeleteElementHandler<PrimitiveType> {

   @Override
   protected CCommand createCommand(final PrimitiveType element) {
      return DeletePrimitiveTypeContribution.create(element.getPackage(), element);
   }
}

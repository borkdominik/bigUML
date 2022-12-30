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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation;

import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.handler.operations.directediting.RenameNamedElementHandler;

public final class RenameOperationHandler extends RenameNamedElementHandler<Operation> {

   public RenameOperationHandler() {
      super(NameLabelSuffix.SUFFIX);
   }

}

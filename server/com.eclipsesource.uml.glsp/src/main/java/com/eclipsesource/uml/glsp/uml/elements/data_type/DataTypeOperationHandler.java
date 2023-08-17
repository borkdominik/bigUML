/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.data_type;

import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;

public class DataTypeOperationHandler extends NodeOperationHandler<DataType, Package> {

   public DataTypeOperationHandler() {
      super(DataTypeConfiguration.typeId());
   }

}

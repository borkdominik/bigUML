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
package com.eclipsesource.uml.glsp.uml.elements.interface_realization;

import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.glsp.uml.handler.element.EdgeOperationHandler;

public class InterfaceRealizationOperationHandler
   extends EdgeOperationHandler<InterfaceRealization, org.eclipse.uml2.uml.Class, Interface> {

   public InterfaceRealizationOperationHandler() {
      super(InterfaceRealizationConfiguration.typeId());
   }

}

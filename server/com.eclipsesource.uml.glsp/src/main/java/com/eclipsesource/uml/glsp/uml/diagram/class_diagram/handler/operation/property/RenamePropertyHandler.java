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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property;

import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyLabelNameSuffix;
import com.eclipsesource.uml.glsp.uml.handler.operations.directediting.DefaultRenameNamedElementHandler;

public class RenamePropertyHandler extends DefaultRenameNamedElementHandler<Property> {

   public RenamePropertyHandler() {
      super(ClassTypes.LABEL_PROPERTY_NAME, PropertyLabelNameSuffix.SUFFIX);
   }

}

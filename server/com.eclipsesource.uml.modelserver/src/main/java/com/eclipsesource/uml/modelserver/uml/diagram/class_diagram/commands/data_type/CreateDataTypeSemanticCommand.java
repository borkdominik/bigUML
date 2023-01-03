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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type;

import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateDataTypeSemanticCommand extends BaseCreateSemanticChildCommand<Package, DataType> {

   public CreateDataTypeSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
   }

   @Override
   protected DataType createSemanticElement(final Package parent) {
      var nameGenerator = new ListNameGenerator(DataType.class, parent.getPackagedElements());

      var dataType = UMLFactory.eINSTANCE.createDataType();
      dataType.setName(nameGenerator.newName());
      parent.getPackagedElements().add(dataType);

      return dataType;
   }

}

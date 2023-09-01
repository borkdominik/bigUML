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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.model;

import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateModelPackageSemanticCommand extends BaseCreateSemanticChildCommand<Package, Model> {

   public CreateModelPackageSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
   }

   @Override
   protected Model createSemanticElement(final Package parent) {
      var nameGenerator = new ListNameGenerator(Model.class, parent.getPackagedElements());

      var model = UMLFactory.eINSTANCE.createModel();
      model.setName(nameGenerator.newName());
      parent.getPackagedElements().add(model);

      return model;
   }

}

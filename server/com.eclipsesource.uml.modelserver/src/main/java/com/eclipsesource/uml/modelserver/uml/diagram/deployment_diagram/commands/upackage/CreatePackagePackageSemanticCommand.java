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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.upackage;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreatePackagePackageSemanticCommand extends BaseCreateSemanticChildCommand<Package, Package> {

   public CreatePackagePackageSemanticCommand(final ModelContext context, final Package parent) {
      super(context, parent);
   }

   @Override
   protected Package createSemanticElement(final Package parent) {
      var nameGenerator = new ListNameGenerator(Package.class, parent.getPackagedElements());

      var upackage = UMLFactory.eINSTANCE.createPackage();
      upackage.setName(nameGenerator.newName());
      parent.getPackagedElements().add(upackage);

      return upackage;
   }

}

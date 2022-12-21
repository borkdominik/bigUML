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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass;

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public class AddClassSemanticCommand extends CreateSemanticChildCommand<Package, Class> {

   protected final Boolean isAbstract;
   protected final NameGenerator nameGenerator;

   public AddClassSemanticCommand(final ModelContext context, final Package parent,
      final Boolean isAbstract) {
      super(context, parent);
      this.isAbstract = isAbstract;
      this.nameGenerator = new PackageableElementNameGenerator(context, Class.class);
   }

   @Override
   protected Class createSemanticElement(final Package parent) {
      return parent.createOwnedClass(nameGenerator.newName(), isAbstract);
   }

}

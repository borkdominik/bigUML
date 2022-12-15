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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public class AddPackageSemanticCommand extends UmlSemanticElementCommand {

   protected final Package newPackage;
   protected final NameGenerator nameGenerator;

   public AddPackageSemanticCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.newPackage = UMLFactory.eINSTANCE.createPackage();
      this.nameGenerator = new PackageableElementNameGenerator(Package.class, modelUri, domain);
   }

   @Override
   protected void doExecute() {
      newPackage.setName(nameGenerator.newName());
      model.getPackagedElements().add(newPackage);
   }

   public Package getNewPackage() { return newPackage; }

}

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
package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.reference;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.matcher.BaseCrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.upackage.DeletePackageCompoundCommand;

public final class PackageReferenceRemover extends BaseCrossReferenceProcessor<Package> {

   @Override
   protected List<Command> process(final ModelContext context, final Setting setting, final Package self,
      final EObject interest) {
      if (!(self instanceof Model)) {

         if (self.getNestingPackage().equals(interest)) {
            return List.of(new DeletePackageCompoundCommand(context, self));
         }
      }

      return List.of();
   }
}

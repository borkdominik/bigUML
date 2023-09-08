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
package com.eclipsesource.uml.modelserver.uml.elements.model;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.matcher.BaseCrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public final class ModelReferenceRemover extends BaseCrossReferenceProcessor<Model> {

   @Override
   protected List<Command> process(final ModelContext context, final Setting setting, final Model self,
      final EObject interest) {
      // TODO Auto-generated method stub
      return null;
   }
   /*-
   @Override
   protected List<Command> process(final ModelContext context, final Setting setting, final Model self,
      final EObject interest) {
      var commands = new LinkedList<Command>();

      for (var el : self.getPackagedElements()) {
         if (el instanceof Manifestation) {
            var manifest = ((Manifestation) el);
            var clients = manifest.getClients();
            var suppliers = manifest.getSuppliers();
            var namedEl = (NamedElement) interest;
            for (var client : clients) {
               if (namedEl.getName().equals(client.getName())) {
                  commands.add(new DeleteManifestationCompoundCommand(context, manifest));
               }
            }
            for (var supplier : suppliers) {
               if (namedEl.getName().equals(supplier.getName())) {
                  commands.add(new DeleteManifestationCompoundCommand(context, manifest));
               }
            }
         }
      }

      if (self.getNearestPackage().equals(interest)) {
         commands.add(new DeleteModelCompoundCommand(context, self));
         return commands;
      }

      return commands;
   }
   */
}

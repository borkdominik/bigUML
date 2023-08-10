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
package com.eclipsesource.uml.modelserver.uml.elements.generalization;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.command.create.CreateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.generalization.reference.GeneralizationReferenceRemover;
import com.eclipsesource.uml.modelserver.uml.manifest.EdgeDefinition;
import com.eclipsesource.uml.modelserver.uml.reference.CrossReferenceRemoveProcessor;
import com.google.inject.multibindings.Multibinder;

public class GeneralizationDefinitionModule extends EdgeDefinition {

   public GeneralizationDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected void createCommandProvider(final Multibinder<CreateCommandProvider<? extends EObject>> contributions) {
      contributions.addBinding().to(GeneralizationDefaultCommandProvider.class);
   }

   @Override
   protected void deleteCommandProvider(final Multibinder<DeleteCommandProvider<? extends EObject>> contributions) {
      contributions.addBinding().to(GeneralizationDefaultCommandProvider.class);
   }

   @Override
   protected void updateCommandProvider(final Multibinder<UpdateCommandProvider<? extends EObject>> contributions) {
      contributions.addBinding().to(GeneralizationDefaultCommandProvider.class);
   }

   @Override
   protected void crossReferenceRemoverProcessors(
      final Multibinder<CrossReferenceRemoveProcessor<? extends EObject>> contributions) {
      contributions.addBinding().to(GeneralizationReferenceRemover.class);
   }
}

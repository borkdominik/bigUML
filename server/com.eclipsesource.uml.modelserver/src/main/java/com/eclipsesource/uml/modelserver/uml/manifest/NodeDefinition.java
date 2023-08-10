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
package com.eclipsesource.uml.modelserver.uml.manifest;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.uml.command.create.CreateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.create.CreateCommandProviderContribution;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProviderContribution;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProviderContribution;
import com.eclipsesource.uml.modelserver.uml.reference.CrossReferenceRemoveProcessor;
import com.eclipsesource.uml.modelserver.uml.reference.CrossReferenceRemoveProcessorContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.multibindings.Multibinder;

public abstract class NodeDefinition extends ElementDefinition
   implements CreateCommandProviderContribution, DeleteCommandProviderContribution, UpdateCommandProviderContribution,
   CrossReferenceRemoveProcessorContribution {

   public NodeDefinition(final String id, final Representation representation) {
      super(id, representation);
   }

   @Override
   protected void configure() {
      super.configure();
      contributeCreateCommandProvider(this::createCommandProvider);
      contributeDeleteCommandProvider(this::deleteCommandProvider);
      contributeUpdateCommandProvider(this::updateCommandProvider);

      contributeCrossReferenceRemoverProcessors(this::crossReferenceRemoverProcessors);
   }

   protected abstract void createCommandProvider(
      final Multibinder<CreateCommandProvider<? extends EObject>> contributions);

   protected abstract void deleteCommandProvider(
      final Multibinder<DeleteCommandProvider<? extends EObject>> contributions);

   protected abstract void updateCommandProvider(
      final Multibinder<UpdateCommandProvider<? extends EObject>> contributions);

   protected void crossReferenceRemoverProcessors(
      final Multibinder<CrossReferenceRemoveProcessor<? extends EObject>> contributions) {}

}

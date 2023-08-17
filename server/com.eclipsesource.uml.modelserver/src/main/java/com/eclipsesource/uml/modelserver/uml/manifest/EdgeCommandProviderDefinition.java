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

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.uml.command.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.create.CreateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public abstract class EdgeCommandProviderDefinition extends EdgeDefinition {

   public EdgeCommandProviderDefinition(final String id, final Representation representation) {
      super(id, representation);
   }

   protected abstract Optional<TypeLiteral<? extends EdgeCommandProvider<?, ?, ?>>> commandProvider();

   @Override
   protected void createCommandProvider(final Multibinder<CreateCommandProvider<? extends EObject>> contributions) {
      commandProvider().ifPresent(i -> contributions.addBinding().to(i));
   }

   @Override
   protected void deleteCommandProvider(final Multibinder<DeleteCommandProvider<? extends EObject>> contributions) {
      commandProvider().ifPresent(i -> contributions.addBinding().to(i));
   }

   @Override
   protected void updateCommandProvider(final Multibinder<UpdateCommandProvider<? extends EObject>> contributions) {
      commandProvider().ifPresent(i -> contributions.addBinding().to(i));
   }
}

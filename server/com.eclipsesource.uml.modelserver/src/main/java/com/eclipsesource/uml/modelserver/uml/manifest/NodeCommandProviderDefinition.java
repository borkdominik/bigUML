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

import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.uml.command.create.node.CreateNodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public abstract class NodeCommandProviderDefinition extends NodeDefinition {

   public NodeCommandProviderDefinition(final String id, final Representation representation) {
      super(id, representation);
   }

   protected Optional<TypeLiteral<? extends NodeCommandProvider<?, ?>>> commandProvider() {
      return Optional.empty();
   }

   protected Optional<List<TypeLiteral<? extends NodeCommandProvider<?, ?>>>> commandProviders() {
      return Optional.empty();
   }

   @Override
   protected void createCommandProvider(
      final Multibinder<CreateNodeCommandProvider<? extends EObject, ?>> contributions) {
      commandProvider().ifPresent(i -> contributions.addBinding().to(i));
      commandProviders().ifPresent(is -> is.forEach(i -> contributions.addBinding().to(i)));

   }

   @Override
   protected void deleteCommandProvider(final Multibinder<DeleteCommandProvider<? extends EObject>> contributions) {
      commandProvider().ifPresent(i -> contributions.addBinding().to(i));
      commandProviders().ifPresent(is -> is.forEach(i -> contributions.addBinding().to(i)));
   }

   @Override
   protected void updateCommandProvider(final Multibinder<UpdateCommandProvider<? extends EObject>> contributions) {
      commandProvider().ifPresent(i -> contributions.addBinding().to(i));
      commandProviders().ifPresent(is -> is.forEach(i -> contributions.addBinding().to(i)));
   }
}

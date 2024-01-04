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
package com.eclipsesource.uml.modelserver.uml.elements.transition;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.behavior.Behavior;
import com.eclipsesource.uml.modelserver.uml.behavior.cross_delete.ExistenceBasedCrossReferenceDeleteBehavior;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.transition.behavior.TransitionReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.manifest.EdgeCommandProviderDefinition;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public class TransitionDefinitionModule extends EdgeCommandProviderDefinition {

   public TransitionDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected Optional<TypeLiteral<? extends EdgeCommandProvider<?, ?, ?>>> commandProvider() {
      return Optional.of(new TypeLiteral<TransitionCommandProvider>() {});
   }

   @Override
   protected void behaviors(final Multibinder<Behavior<? extends EObject>> contributions) {
      contributions.addBinding().to(new TypeLiteral<ExistenceBasedCrossReferenceDeleteBehavior<Transition>>() {});
      contributions.addBinding().to(new TypeLiteral<TransitionReconnectBehavior<Transition>>() {});
   }
}

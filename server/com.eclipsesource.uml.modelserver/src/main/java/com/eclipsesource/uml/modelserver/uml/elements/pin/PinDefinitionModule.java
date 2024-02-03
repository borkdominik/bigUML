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
package com.eclipsesource.uml.modelserver.uml.elements.pin;

import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.uml2.uml.InputPin;
import org.eclipse.uml2.uml.OutputPin;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.behavior.Behavior;
import com.eclipsesource.uml.modelserver.uml.behavior.cross_delete.DescendantBasedCrossReferenceDeleteBehavior;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.manifest.NodeCommandProviderDefinition;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public class PinDefinitionModule extends NodeCommandProviderDefinition {

   public PinDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected Optional<List<TypeLiteral<? extends NodeCommandProvider<?, ?>>>> commandProviders() {
      return Optional
         .of(List.of(
            new TypeLiteral<InputPinCommandProvider>() {},
            new TypeLiteral<OutputPinCommandProvider>() {}));
   }

   @Override
   protected void behaviors(final Multibinder<Behavior<? extends EObject>> contributions) {
      super.behaviors(contributions);
      contributions.addBinding()
         .to(new TypeLiteral<DescendantBasedCrossReferenceDeleteBehavior<InputPin>>() {});
      contributions.addBinding()
         .to(new TypeLiteral<DescendantBasedCrossReferenceDeleteBehavior<OutputPin>>() {});
   }
}

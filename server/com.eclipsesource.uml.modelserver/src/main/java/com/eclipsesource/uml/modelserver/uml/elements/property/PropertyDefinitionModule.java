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
package com.eclipsesource.uml.modelserver.uml.elements.property;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.behavior.Behavior;
import com.eclipsesource.uml.modelserver.uml.command.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.property.reference.PropertyReferenceRemover;
import com.eclipsesource.uml.modelserver.uml.manifest.NodeCommandProviderDefinition;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public class PropertyDefinitionModule extends NodeCommandProviderDefinition {

   public PropertyDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected Optional<TypeLiteral<? extends NodeCommandProvider<?, ?>>> commandProvider() {
      return Optional.of(new TypeLiteral<PropertyCommandProvider>() {});
   }

   @Override
   protected void behaviors(final Multibinder<Behavior<? extends EObject>> contributions) {
      contributions.addBinding().to(PropertyReferenceRemover.class);
   }
}

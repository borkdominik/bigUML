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
package com.eclipsesource.uml.modelserver.uml.elements.extend;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.command.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.extend.reference.ExtendReferenceRemover;
import com.eclipsesource.uml.modelserver.uml.manifest.EdgeCommandProviderDefinition;
import com.eclipsesource.uml.modelserver.uml.reference.CrossReferenceRemoveProcessor;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public class ExtendDefinitionModule extends EdgeCommandProviderDefinition {

   public ExtendDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected Optional<TypeLiteral<? extends EdgeCommandProvider<?, ?, ?>>> commandProvider() {
      return Optional.of(new TypeLiteral<ExtendCommandProvider>() {});
   }

   @Override
   protected void crossReferenceRemoverProcessors(
      final Multibinder<CrossReferenceRemoveProcessor<? extends EObject>> contributions) {
      contributions.addBinding().to(ExtendReferenceRemover.class);
   }
}

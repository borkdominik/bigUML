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
package com.eclipsesource.uml.modelserver.uml.elements.operation;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.manifest.NodeCommandProviderDefinition;
import com.google.inject.TypeLiteral;

public class OperationDefinitionModule extends NodeCommandProviderDefinition {

   public OperationDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected Optional<TypeLiteral<? extends NodeCommandProvider<?, ?>>> commandProvider() {
      return Optional.of(new TypeLiteral<OperationCommandProvider>() {});
   }
}

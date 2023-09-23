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
package com.eclipsesource.uml.modelserver.uml.elements.manifestation.behavior;

import java.util.List;

import org.eclipse.uml2.uml.Manifestation;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.elements.dependency.behavior.DependencyReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.elements.manifestation.commands.UpdateManifestationArgument;

public class ManifestationReconnectBehavior<TElement extends Manifestation>
   extends DependencyReconnectBehavior<TElement> {

   @Override
   protected UpdateManifestationArgument argument(final ModelContext context, final TElement element,
      final List<String> sources,
      final List<String> targets) {
      return UpdateManifestationArgument.by().clientIds(sources).supplierIds(targets).build();
   }
}

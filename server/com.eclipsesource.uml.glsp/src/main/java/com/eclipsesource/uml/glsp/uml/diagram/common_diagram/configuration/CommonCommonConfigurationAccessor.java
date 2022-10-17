/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.configuration;

import java.util.Optional;
import java.util.Set;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class CommonCommonConfigurationAccessor {
   @Inject
   private Set<CommonDiagramConfiguration> configurations;

   @Inject
   private UmlModelState modelState;

   public Optional<CommonDiagramConfiguration> get(final Representation representation) {
      return configurations.stream().filter(c -> c.getRepresentation() == representation).findFirst();
   }

   public Optional<CommonDiagramConfiguration> getActive() {
      var representation = modelState.getRepresentation();
      return get(representation);
   }
}

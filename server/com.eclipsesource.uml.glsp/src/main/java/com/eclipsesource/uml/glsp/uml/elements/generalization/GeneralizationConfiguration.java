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
package com.eclipsesource.uml.glsp.uml.elements.generalization;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationEdgeConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class GeneralizationConfiguration extends RepresentationEdgeConfiguration<Generalization> {
   @Inject
   public GeneralizationConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public enum Property {
      IS_SUBSTITUTABLE
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(typeId(), GraphPackage.Literals.GEDGE); }

   @Override
   public Set<EdgeTypeHint> getEdgeTypeHints() {
      var hints = new HashSet<EdgeTypeHint>();

      if (existsConfigurationFor(Set.of(org.eclipse.uml2.uml.Class.class))) {
         hints.addAll(Set.of(
            new EdgeTypeHint(typeId(), true, true, true,
               List.of(configurationFor(org.eclipse.uml2.uml.Class.class).typeId()),
               List.of(configurationFor(org.eclipse.uml2.uml.Class.class).typeId()))

         ));
      }

      if (existsConfigurationFor(Set.of(Actor.class))) {
         hints.addAll(Set.of(
            new EdgeTypeHint(typeId(), true, true, true,
               List.of(configurationFor(Actor.class).typeId()),
               List.of(configurationFor(Actor.class).typeId()))

         ));
      }

      return hints;
   }
}

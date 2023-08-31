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
package com.eclipsesource.uml.glsp.uml.elements.region;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.pseudostate.PseudostateConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class RegionConfiguration extends RepresentationNodeConfiguration<Region> {

   @Inject
   public RegionConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public enum Property {
      NAME
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(
      typeId(), GraphPackage.Literals.GNODE); }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      var pseudo = configurationFor(Pseudostate.class, PseudostateConfiguration.class);

      return Set.of(
         new ShapeTypeHint(typeId(), true, true, true, false,
            List.of(
               pseudo.initialStateTypeId(),
               configurationFor(State.class).typeId(),
               configurationFor(FinalState.class).typeId(),
               pseudo.choiceTypeId(),
               pseudo.joinTypeId(),
               pseudo.forkTypeId(),
               pseudo.shallowHistoryTypeId(),
               pseudo.deepHistoryTypeId())));
   }

}

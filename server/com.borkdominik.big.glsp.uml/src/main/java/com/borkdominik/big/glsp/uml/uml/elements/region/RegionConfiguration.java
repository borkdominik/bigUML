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
package com.borkdominik.big.glsp.uml.uml.elements.region;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.configuration.base.BGBaseNodeConfiguration;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class RegionConfiguration extends BGBaseNodeConfiguration {
   protected final String typeId = UMLTypes.REGION.prefix(representation);

   @Inject
   public RegionConfiguration(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   public enum Property {
      NAME
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(typeId, GraphPackage.Literals.GNODE); }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(typeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(
               Set.of(
                  UMLTypes.INITIAL_STATE,
                  UMLTypes.CHOICE,
                  UMLTypes.JOIN,
                  UMLTypes.FORK,
                  UMLTypes.SHALLOW_HISTORY,
                  UMLTypes.DEEP_HISTORY,
                  UMLTypes.STATE,
                  UMLTypes.FINAL_STATE))));
   }
}

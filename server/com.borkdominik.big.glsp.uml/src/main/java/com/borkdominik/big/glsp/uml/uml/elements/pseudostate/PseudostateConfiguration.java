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
package com.borkdominik.big.glsp.uml.uml.elements.pseudostate;

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

public class PseudostateConfiguration extends BGBaseNodeConfiguration {
   protected final String choiceTypeId = UMLTypes.CHOICE.prefix(representation);
   protected final String deepHistoryTypeId = UMLTypes.DEEP_HISTORY.prefix(representation);
   protected final String forkTypeId = UMLTypes.FORK.prefix(representation);
   protected final String initialStateTypeId = UMLTypes.INITIAL_STATE.prefix(representation);
   protected final String joinTypeId = UMLTypes.JOIN.prefix(representation);
   protected final String shallowHistoryTypeId = UMLTypes.SHALLOW_HISTORY.prefix(representation);

   @Inject
   public PseudostateConfiguration(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.of(
         choiceTypeId, GraphPackage.Literals.GNODE,
         deepHistoryTypeId, GraphPackage.Literals.GNODE,
         forkTypeId, GraphPackage.Literals.GNODE,
         initialStateTypeId, GraphPackage.Literals.GNODE,
         joinTypeId, GraphPackage.Literals.GNODE,
         shallowHistoryTypeId, GraphPackage.Literals.GNODE);
   }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(choiceTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(deepHistoryTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(forkTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(initialStateTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(joinTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(shallowHistoryTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())));
   }
}

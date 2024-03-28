/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.association;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.configuration.base.BGBaseEdgeConfiguration;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class AssociationConfiguration extends BGBaseEdgeConfiguration {
   protected final String associationTypeId = UMLTypes.ASSOCIATION.prefix(representation);
   protected final String compositionTypeId = UMLTypes.COMPOSITION.prefix(representation);
   protected final String aggregationTypeId = UMLTypes.AGGREGATION.prefix(representation);

   @Inject
   public AssociationConfiguration(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.of(
         associationTypeId, GraphPackage.Literals.GEDGE,
         aggregationTypeId, GraphPackage.Literals.GEDGE,
         compositionTypeId, GraphPackage.Literals.GEDGE);
   }

   @Override
   public Set<EdgeTypeHint> getEdgeTypeHints() {
      return Set.of(
         new EdgeTypeHint(associationTypeId, true, true, true,
            elementConfig()
               .existingConfigurationTypeIds(Set.of(UMLTypes.CLASS, UMLTypes.INTERFACE, UMLTypes.ACTOR)),
            elementConfig()
               .existingConfigurationTypeIds(
                  Set.of(UMLTypes.CLASS, UMLTypes.INTERFACE, UMLTypes.USE_CASE))),

         new EdgeTypeHint(aggregationTypeId, true, true, true,
            elementConfig().existingConfigurationTypeIds(Set.of(UMLTypes.CLASS, UMLTypes.INTERFACE)),
            elementConfig().existingConfigurationTypeIds(Set.of(UMLTypes.CLASS, UMLTypes.INTERFACE))),

         new EdgeTypeHint(compositionTypeId, true, true, true,
            elementConfig().existingConfigurationTypeIds(Set.of(UMLTypes.CLASS, UMLTypes.INTERFACE)),
            elementConfig().existingConfigurationTypeIds(Set.of(UMLTypes.CLASS, UMLTypes.INTERFACE)))

      );
   }
}

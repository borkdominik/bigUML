/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.association.features;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.uml2.uml.Association;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyBuilder;
import com.borkdominik.big.glsp.server.features.property_palette.model.ElementPropertyItem;
import com.borkdominik.big.glsp.server.features.property_palette.provider.integrations.BGEMFElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.element.VisibilityKindUtils;
import com.borkdominik.big.glsp.uml.uml.elements.multiplicity_element.MultiplicityElementPropertyProvider;
import com.borkdominik.big.glsp.uml.uml.elements.multiplicity_element.MultiplicityUtil;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementPropertyProvider;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class AssociationPropertyProvider extends BGEMFElementPropertyProvider<Association> {

   @Inject
   public AssociationPropertyProvider(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes, Set.of());
   }

   @Override
   public List<ElementPropertyItem> doProvide(final Association element) {
      var memberEnds = element.getMemberEnds();

      var properties = new ArrayList<ElementPropertyItem>();
      properties.addAll(provideIfConfigured(Set.of(UMLTypes.PROPERTY), () -> {
         var sourceProperty = memberEnds.get(0);
         var sourcePropertyId = idGenerator.getOrCreateId(sourceProperty);

         return new ElementPropertyBuilder(sourcePropertyId)
            .text(NamedElementPropertyProvider.NAME, "Source Name", sourceProperty.getName())
            .choice(
               NamedElementPropertyProvider.VISIBILITY_KIND,
               "Source Visibility",
               VisibilityKindUtils.asChoices(),
               sourceProperty.getVisibility().getLiteral())
            .text(MultiplicityElementPropertyProvider.MULTIPLICITY, "Source Multiplicity",
               MultiplicityUtil.getMultiplicity(sourceProperty))
            .items();

      }));
      properties.addAll(provideIfConfigured(Set.of(UMLTypes.PROPERTY), () -> {
         var targetProperty = memberEnds.get(1);
         var targetPropertyId = idGenerator.getOrCreateId(targetProperty);

         return new ElementPropertyBuilder(targetPropertyId)
            .text(NamedElementPropertyProvider.NAME, "Target Name", targetProperty.getName())
            .choice(
               NamedElementPropertyProvider.VISIBILITY_KIND,
               "Target Visibility",
               VisibilityKindUtils.asChoices(),
               targetProperty.getVisibility().getLiteral())
            .text(MultiplicityElementPropertyProvider.MULTIPLICITY, "Target Multiplicity",
               MultiplicityUtil.getMultiplicity(targetProperty))
            .items();
      }));
      return properties;
   }
}

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
package com.eclipsesource.uml.glsp.uml.elements.property;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PropertyConfiguration extends RepresentationNodeConfiguration<Property> {
   static String ID = Property.class.getSimpleName();

   @Inject
   public PropertyConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public String typeTypeId() {
      return QualifiedUtil.typeId(representation, DefaultTypes.LABEL,
         ID + "-type");
   }

   public String multiplicityTypeId() {
      return QualifiedUtil.typeId(representation, DefaultTypes.LABEL,
         ID + "-multiplicity");
   }

   public enum Property {
      NAME,
      IS_DERIVED,
      IS_ORDERED,
      IS_STATIC,
      IS_DERIVED_UNION,
      IS_READ_ONLY,
      IS_UNIQUE,
      VISIBILITY_KIND,
      MULTIPLICITY,
      IS_NAVIGABLE,
      AGGREGATION,
      TYPE;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.of(
         typeId(), GraphPackage.Literals.GNODE,
         typeTypeId(), GraphPackage.Literals.GLABEL,
         multiplicityTypeId(), GraphPackage.Literals.GLABEL);
   }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(typeId(), false, true, false, false,
            existingConfigurationTypeIds(Set.of())));
   }
}

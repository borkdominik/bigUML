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
package com.eclipsesource.uml.glsp.uml.elements.literal_specification;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.LiteralBoolean;
import org.eclipse.uml2.uml.LiteralInteger;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.LiteralString;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class LiteralSpecificationConfiguration extends RepresentationNodeConfiguration<LiteralSpecification> {

   @Inject
   public LiteralSpecificationConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public String typeId() {
      throw new IllegalStateException("LiteralSpecification does not allow using typeId");
   }

   public String literalBooleanTypeId() {
      return QualifiedUtil.typeId(representation, DefaultTypes.COMPARTMENT,
         LiteralBoolean.class.getSimpleName());
   }

   public String literalStringTypeId() {
      return QualifiedUtil.typeId(representation, DefaultTypes.COMPARTMENT,
         LiteralString.class.getSimpleName());
   }

   public String literalIntegerTypeId() {
      return QualifiedUtil.typeId(representation, DefaultTypes.COMPARTMENT,
         LiteralInteger.class.getSimpleName());
   }

   public enum Property {
      NAME,
      VALUE
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.of(
         literalBooleanTypeId(), GraphPackage.Literals.GCOMPARTMENT,
         literalStringTypeId(), GraphPackage.Literals.GCOMPARTMENT,
         literalIntegerTypeId(), GraphPackage.Literals.GCOMPARTMENT);
   }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(literalBooleanTypeId(), false, true, false, false, existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(literalStringTypeId(), false, true, false, false, existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(literalIntegerTypeId(), false, true, false, false, existingConfigurationTypeIds(Set.of())));
   }
}

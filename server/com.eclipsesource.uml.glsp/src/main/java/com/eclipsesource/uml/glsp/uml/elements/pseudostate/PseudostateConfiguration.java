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
package com.eclipsesource.uml.glsp.uml.elements.pseudostate;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.Pseudostate;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PseudostateConfiguration extends RepresentationNodeConfiguration<Pseudostate> {

   @Inject
   public PseudostateConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public String typeId() {
      throw new IllegalAccessError("TypeId can not be used for PseudoState");
   }

   public String choiceTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_DIAMOND,
         "Choice");
   }

   public String deepHistoryTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE,
         "DeepHistory");
   }

   public String forkTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE,
         "Fork");
   }

   public String initialStateTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE,
         "InitialState");
   }

   public String joinTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE,
         "Join");
   }

   public String shallowHistoryTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE,
         "ShallowHistory");
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.of(
         choiceTypeId(), GraphPackage.Literals.GNODE,
         deepHistoryTypeId(), GraphPackage.Literals.GNODE,
         forkTypeId(), GraphPackage.Literals.GNODE,
         initialStateTypeId(), GraphPackage.Literals.GNODE,
         joinTypeId(), GraphPackage.Literals.GNODE,
         shallowHistoryTypeId(), GraphPackage.Literals.GNODE);
   }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(choiceTypeId(), true, true, true, false, existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(deepHistoryTypeId(), true, true, true, false, existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(forkTypeId(), true, true, true, false, existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(initialStateTypeId(), true, true, true, false, existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(joinTypeId(), true, true, true, false, existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(shallowHistoryTypeId(), true, true, true, false, existingConfigurationTypeIds(Set.of())));
   }
}

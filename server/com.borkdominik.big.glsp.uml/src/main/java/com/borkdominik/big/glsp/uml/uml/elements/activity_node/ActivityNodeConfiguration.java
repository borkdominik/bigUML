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
package com.borkdominik.big.glsp.uml.uml.elements.activity_node;

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

public class ActivityNodeConfiguration extends BGBaseNodeConfiguration {
   protected final String activityNodeTypeId = UMLTypes.ACTIVITY_NODE.prefix(representation);
   protected final String opaqueActionTypeId = UMLTypes.OPAQUE_ACTION.prefix(representation);
   protected final String acceptEventActionTypeId = UMLTypes.ACCEPT_EVENT_ACTION.prefix(representation);
   protected final String sendSignalActionTypeId = UMLTypes.SEND_SIGNAL_ACTION.prefix(representation);
   protected final String activityFinalNodeTypeId = UMLTypes.ACTIVITY_FINAL_NODE.prefix(representation);
   protected final String decisionNodeTypeId = UMLTypes.DECISION_NODE.prefix(representation);
   protected final String forkNodeTypeId = UMLTypes.FORK_NODE.prefix(representation);
   protected final String initialNodeTypeId = UMLTypes.INITIAL_NODE.prefix(representation);
   protected final String flowFinalNodeTypeId = UMLTypes.FLOW_FINAL_NODE.prefix(representation);
   protected final String joinNodeTypeId = UMLTypes.JOIN_NODE.prefix(representation);
   protected final String mergeNodeTypeId = UMLTypes.MERGE_NODE.prefix(representation);
   protected final String activityParameterNodeTypeId = UMLTypes.ACTIVITY_PARAMETER_NODE.prefix(representation);
   protected final String centralBufferNodeTypeId = UMLTypes.CENTRAL_BUFFER_NODE.prefix(representation);

   @Inject
   public ActivityNodeConfiguration(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      return Map.ofEntries(
         Map.entry(opaqueActionTypeId, GraphPackage.Literals.GNODE),
         Map.entry(acceptEventActionTypeId, GraphPackage.Literals.GNODE),
         Map.entry(sendSignalActionTypeId, GraphPackage.Literals.GNODE),
         Map.entry(activityFinalNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(decisionNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(forkNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(flowFinalNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(initialNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(joinNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(mergeNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(centralBufferNodeTypeId, GraphPackage.Literals.GNODE),
         Map.entry(activityParameterNodeTypeId, GraphPackage.Literals.GNODE));
   }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(activityNodeTypeId); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(opaqueActionTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of(UMLTypes.INPUT_PIN, UMLTypes.OUTPUT_PIN))),
         new ShapeTypeHint(acceptEventActionTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(sendSignalActionTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(activityFinalNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(decisionNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(forkNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(flowFinalNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(initialNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(joinNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(mergeNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(centralBufferNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())),
         new ShapeTypeHint(activityParameterNodeTypeId, true, true, true, false,
            elementConfig().existingConfigurationTypeIds(Set.of())));
   }
}

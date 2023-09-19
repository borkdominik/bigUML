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
package com.eclipsesource.uml.glsp.uml.elements.control_flow;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ControlFlow;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationEdgeConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ControlFlowConfiguration extends RepresentationEdgeConfiguration<ControlFlow> {
   @Inject
   public ControlFlowConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public enum Property {
      GUARD,
      WEIGHT
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(
      typeId(), GraphPackage.Literals.GEDGE); }

   @Override
   public Set<EdgeTypeHint> getEdgeTypeHints() {
      // TODO:
      /*-
       *         List.of(UmlActivity_Action.typeId(),
                  UmlActivity_AcceptEventAction.typeId(),
                  UmlActivity_SendSignalAction.typeId(),
                  UmlActivity_DecisionNode.typeId(),
                  UmlActivity_ForkNode.typeId(),
                  UmlActivity_JoinNode.typeId(),
                  UmlActivity_MergeNode.typeId(),
                  UmlActivity_InitialNode.typeId(),
                  UmlActivity_ObjectNode.typeId(),
                  UmlActivity_OutputPin.typeId(),
                  UmlActivity_ActivityParameter.typeId()),
               List.of(UmlActivity_Action.typeId(),
                  UmlActivity_AcceptEventAction.typeId(),
                  UmlActivity_SendSignalAction.typeId(),
                  UmlActivity_ActivityFinalNode.typeId(),
                  UmlActivity_DecisionNode.typeId(),
                  UmlActivity_ForkNode.typeId(),
                  UmlActivity_JoinNode.typeId(),
                  UmlActivity_FlowFinalNode.typeId(),
                  UmlActivity_MergeNode.typeId(),
                  UmlActivity_ObjectNode.typeId(),
                  UmlActivity_InputPin.typeId())));
       */
      return Set.of(
         new EdgeTypeHint(typeId(), true, true, true,
            existingConfigurationTypeIds(Set.of(ActivityNode.class)),
            existingConfigurationTypeIds(Set.of(ActivityNode.class)))

      );
   }
}

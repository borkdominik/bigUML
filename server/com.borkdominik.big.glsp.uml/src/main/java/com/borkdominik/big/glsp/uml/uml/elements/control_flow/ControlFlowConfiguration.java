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
package com.borkdominik.big.glsp.uml.uml.elements.control_flow;

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

public class ControlFlowConfiguration extends BGBaseEdgeConfiguration {
   protected final String typeId = UMLTypes.CONTROL_FLOW.prefix(representation);

   @Inject
   public ControlFlowConfiguration(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   public enum Property {
      GUARD,
      WEIGHT
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(
      typeId, GraphPackage.Literals.GEDGE); }

   @Override
   public Set<EdgeTypeHint> getEdgeTypeHints() {
      return Set.of(
         new EdgeTypeHint(typeId, true, true, true,
            elementConfig().existingConfigurationTypeIds(Set.of(
               UMLTypes.OPAQUE_ACTION,
               UMLTypes.ACCEPT_EVENT_ACTION,
               UMLTypes.SEND_SIGNAL_ACTION,
               UMLTypes.DECISION_NODE,
               UMLTypes.FORK_NODE,
               UMLTypes.JOIN_NODE,
               UMLTypes.MERGE_NODE,
               UMLTypes.INITIAL_NODE,
               UMLTypes.CENTRAL_BUFFER_NODE,
               UMLTypes.ACTIVITY_PARAMETER_NODE)),
            elementConfig().existingConfigurationTypeIds(Set.of(
               UMLTypes.OPAQUE_ACTION,
               UMLTypes.ACCEPT_EVENT_ACTION,
               UMLTypes.SEND_SIGNAL_ACTION,
               UMLTypes.ACTIVITY_FINAL_NODE,
               UMLTypes.DECISION_NODE,
               UMLTypes.FORK_NODE,
               UMLTypes.JOIN_NODE,
               UMLTypes.FLOW_FINAL_NODE,
               UMLTypes.MERGE_NODE,
               UMLTypes.CENTRAL_BUFFER_NODE,
               UMLTypes.ACTIVITY_PARAMETER_NODE))));
   }

}

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
package com.eclipsesource.uml.glsp.uml.elements.activity_node;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.AcceptEventAction;
import org.eclipse.uml2.uml.ActivityFinalNode;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityParameterNode;
import org.eclipse.uml2.uml.CentralBufferNode;
import org.eclipse.uml2.uml.DecisionNode;
import org.eclipse.uml2.uml.FlowFinalNode;
import org.eclipse.uml2.uml.ForkNode;
import org.eclipse.uml2.uml.InitialNode;
import org.eclipse.uml2.uml.InputPin;
import org.eclipse.uml2.uml.JoinNode;
import org.eclipse.uml2.uml.MergeNode;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.OutputPin;
import org.eclipse.uml2.uml.SendSignalAction;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityNodeConfiguration extends RepresentationNodeConfiguration<ActivityNode> {
   @Override
   public Set<Class<? extends ActivityNode>> getElementTypes() {
      return Set.of(getElementType(), OpaqueAction.class, AcceptEventAction.class, SendSignalAction.class,
         ActivityFinalNode.class, DecisionNode.class, FlowFinalNode.class, ForkNode.class, InitialNode.class,
         JoinNode.class, MergeNode.class, ActivityParameterNode.class, CentralBufferNode.class);
   }

   @Inject
   public ActivityNodeConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public String typeId() {
      throw new IllegalAccessError("TypeId can not be used for ActivityNode");
   }

   // Actions
   public String acceptEventActionTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE,
         AcceptEventAction.class.getSimpleName());
   }

   public String sendSignalActionTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE,
         SendSignalAction.class.getSimpleName());
   }

   public String opaqueActionTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE,
         OpaqueAction.class.getSimpleName());
   }

   // Control Nodes
   public String activityFinalNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE,
         ActivityFinalNode.class.getSimpleName());
   }

   public String decisionNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_DIAMOND,
         DecisionNode.class.getSimpleName());
   }

   public String forkNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE,
         ForkNode.class.getSimpleName());
   }

   public String initialNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE,
         InitialNode.class.getSimpleName());
   }

   public String flowFinalNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_CIRCLE,
         FlowFinalNode.class.getSimpleName());
   }

   public String joinNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_RECTANGLE,
         JoinNode.class.getSimpleName());
   }

   public String mergeNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE_DIAMOND,
         MergeNode.class.getSimpleName());
   }

   // Object Nodes
   public String activityParameterNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.PORT,
         ActivityParameterNode.class.getSimpleName());
   }

   public String centralBufferNodeTypeId() {
      return QualifiedUtil.representationTypeId(representation, DefaultTypes.NODE,
         CentralBufferNode.class.getSimpleName());
   }

   public enum Property {
      NAME,
      VISIBILITY_KIND
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      var map = new HashMap<String, EClass>();

      map.putAll(Map.of(
         acceptEventActionTypeId(), GraphPackage.Literals.GNODE,
         sendSignalActionTypeId(), GraphPackage.Literals.GNODE,
         opaqueActionTypeId(), GraphPackage.Literals.GNODE));
      map.putAll(Map.of(
         activityFinalNodeTypeId(), GraphPackage.Literals.GNODE,
         decisionNodeTypeId(), GraphPackage.Literals.GNODE,
         forkNodeTypeId(), GraphPackage.Literals.GNODE,
         flowFinalNodeTypeId(), GraphPackage.Literals.GNODE,
         initialNodeTypeId(), GraphPackage.Literals.GNODE,
         joinNodeTypeId(), GraphPackage.Literals.GNODE,
         mergeNodeTypeId(), GraphPackage.Literals.GNODE));
      map.putAll(Map.of(
         centralBufferNodeTypeId(), GraphPackage.Literals.GNODE,
         activityParameterNodeTypeId(), GraphPackage.Literals.GNODE));

      return map;
   }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return getTypeMappings().keySet().stream()
         .map(key -> {
            if (key.equals(opaqueActionTypeId())) {
               return new ShapeTypeHint(key, true, true, true, false,
                  existingConfigurationTypeIds(Set.of(InputPin.class, OutputPin.class)));
            }

            return new ShapeTypeHint(key, true, true, true, false,
               existingConfigurationTypeIds(Set.of()));
         })
         .collect(Collectors.toSet());
   }
}

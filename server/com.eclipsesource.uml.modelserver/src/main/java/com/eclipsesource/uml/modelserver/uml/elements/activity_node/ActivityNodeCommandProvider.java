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
package com.eclipsesource.uml.modelserver.uml.elements.activity_node;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.AcceptEventAction;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityFinalNode;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityParameterNode;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.CentralBufferNode;
import org.eclipse.uml2.uml.DecisionNode;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.FlowFinalNode;
import org.eclipse.uml2.uml.ForkNode;
import org.eclipse.uml2.uml.InitialNode;
import org.eclipse.uml2.uml.JoinNode;
import org.eclipse.uml2.uml.MergeNode;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.SendSignalAction;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands.CreateActivityNodeArgument;
import com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands.CreateActivityNodeSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands.UpdateActivityNodeArgument;
import com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands.UpdateActivityNodeSemanticCommand;

public class ActivityNodeCommandProvider extends NodeCommandProvider<ActivityNode, Element> {

   @Override
   public Set<Class<? extends ActivityNode>> getElementTypes() {
      return Set.of(getElementType(), OpaqueAction.class, AcceptEventAction.class, SendSignalAction.class,
         ActivityFinalNode.class, DecisionNode.class, FlowFinalNode.class, ForkNode.class, InitialNode.class,
         JoinNode.class, MergeNode.class, ActivityParameterNode.class, CentralBufferNode.class);
   }

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Element parent,
      final GPoint position) {
      var commands = new ArrayList<Command>();
      BaseCreateSemanticChildCommand<?, ActivityNode> semantic = null;
      var argument = context.decoder().embedJson(CreateActivityNodeArgument.class,
         new CreateActivityNodeArgument.Deserializer());

      if (parent instanceof Activity) {
         semantic = new CreateActivityNodeSemanticCommand(context, (Activity) parent,
            new CreateActivityNodeArgument(argument.nodeLiteral));
         commands.add(semantic);
      } else if (parent instanceof ActivityPartition) {
         var p = (ActivityPartition) parent;

         semantic = new CreateActivityNodeSemanticCommand(context, p.containingActivity(),
            new CreateActivityNodeArgument(argument.nodeLiteral));

         var updateArgument = UpdateActivityNodeArgument.by()
            .inPartitionsIds(List.of(SemanticElementAccessor.getId(parent))).build();
         var update = new UpdateActivityNodeSemanticCommand(context, semantic::getSemanticElement, updateArgument);
         commands.add(semantic);
         commands.add(update);
      } else {
         throw new IllegalArgumentException(String.format("Parent %s can not be handled", parent.getClass().getName()));
      }

      commands.add(new AddShapeNotationCommand(
         context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50)));
      return commands;
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final ActivityNode element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateActivityNodeArgument.class);
      return List.of(new UpdateActivityNodeSemanticCommand(context, element, update));
   }
}

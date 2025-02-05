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

import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Type;

import com.borkdominik.big.glsp.server.core.commands.BGRecordingRunnableCommand;
import com.borkdominik.big.glsp.server.core.commands.emf.notation.BGEMFDeleteNotationCommand;
import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateEdgeSemanticCommand;
import com.borkdominik.big.glsp.server.core.commands.semantic.BGDeleteElementSemanticCommand;
import com.borkdominik.big.glsp.server.core.handler.operation.delete.BGDeleteHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.reconnect_edge.BGReconnectEdgeHandler;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFEdgeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class AssociationOperationHandler extends BGEMFEdgeOperationHandler<Association, Type, Type>
   implements BGDeleteHandler, BGReconnectEdgeHandler {

   @Inject
   public AssociationOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   protected BGCreateEdgeSemanticCommand<Association, Type, Type, ?> createSemanticCommand(
      final CreateEdgeOperation operation, final Type source, final Type target) {
      var elementTypeId = operation.getElementTypeId();
      var argument = UMLCreateEdgeCommand.Argument
         .<Association, Type, Type> createEdgeArgumentBuilder()
         .supplier((s, t) -> {
            var name = "";
            if (operation.getArgs() != null) {
               name = operation.getArgs().getOrDefault("name", null);

            }
            var type = AggregationKind.NONE_LITERAL;
            if (UMLTypes.AGGREGATION.isSame(representation, elementTypeId)) {
               type = AggregationKind.SHARED_LITERAL;
            } else if (UMLTypes.COMPOSITION.isSame(representation, elementTypeId)) {
               type = AggregationKind.COMPOSITE_LITERAL;
            }
            // todo check if source and target should be set
            var x = source.createAssociation(true,
               type,
               null,
               1, 1,
               target,
               true,
               AggregationKind.NONE_LITERAL,
               null,
               1, 1);
            x.setName(name);
            return x;
         })
         .build();

      return new UMLCreateEdgeCommand<>(commandContext, source, target, argument);
   }

   @Override
   public Optional<Command> handleDelete(final DeleteOperation operation, final EObject object) {
      var semanticElement = modelState.getElementIndex().getSemanticOrThrow(object, Association.class);

      var command = new CompoundCommand();
      for (var end : semanticElement.getMemberEnds()) {
         if (!EcoreUtil.isAncestor(semanticElement, end)) {
            command.append(new BGDeleteElementSemanticCommand(commandContext, modelState.getSemanticModel(), end));
         }
      }

      command
         .append(new BGDeleteElementSemanticCommand(commandContext, modelState.getSemanticModel(), semanticElement));
      command.append(new BGEMFDeleteNotationCommand(commandContext, semanticElement));

      return Optional.of(command);
   }

   @Override
   public Optional<Command> handleReconnect(final ReconnectEdgeOperation operation, final EObject element) {
      var elementId = operation.getEdgeElementId();
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var semanticElement = modelState.getElementIndex().getOrThrow(elementId, Association.class);
      var source = modelState.getElementIndex().getOrThrow(sourceId, Type.class);
      var target = modelState.getElementIndex().getOrThrow(targetId, Type.class);

      return Optional.of(new BGRecordingRunnableCommand(modelState.getSemanticModel(), () -> {
         var oldMemberEnds = semanticElement.getMemberEnds();
         var oldSourceProperty = oldMemberEnds.get(0);
         var oldTargetProperty = oldMemberEnds.get(1);

         if (oldSourceProperty.getOwner() instanceof AttributeOwner
            && oldTargetProperty.getOwner() instanceof AttributeOwner) {
            var oldSourceOwner = (AttributeOwner) oldSourceProperty.getOwner();
            var oldTargetOwner = (AttributeOwner) oldTargetProperty.getOwner();
            var newSourceOwner = (Type & AttributeOwner) source;
            var newTargetOwner = (Type & AttributeOwner) target;

            oldSourceOwner.getOwnedAttributes().remove(oldSourceProperty);
            oldSourceProperty.setType(source);
            newSourceOwner.getOwnedAttributes().add(oldSourceProperty);

            oldTargetOwner.getOwnedAttributes().remove(oldTargetProperty);
            oldTargetProperty.setType(target);
            newTargetOwner.getOwnedAttributes().add(oldTargetProperty);
         } else if (oldSourceProperty.getOwner() instanceof Association
            && oldTargetProperty.getOwner() instanceof Association) {
            oldSourceProperty.setType(source);
            oldTargetProperty.setType(target);
         }

      }));
   }

}

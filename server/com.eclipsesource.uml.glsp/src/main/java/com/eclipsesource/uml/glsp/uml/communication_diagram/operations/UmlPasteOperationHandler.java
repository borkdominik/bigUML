/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.communication_diagram.operations;

import static org.eclipse.glsp.server.utils.GeometryUtil.shift;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GBoundsAware;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.impl.GPointImpl;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.gson.GraphGsonConfigurationFactory;
import org.eclipse.glsp.server.operations.PasteOperation;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.glsp.actions.UmlRequestClipboardDataActionHandler;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.property.InteractionPropertiesFactory;
import com.eclipsesource.uml.glsp.property.LifelinePropertiesFactory;
import com.eclipsesource.uml.glsp.property.MessagePropertiesFactory;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlGModelUtil;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.CopyInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.InteractionCopyableProperties;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.CopyLifelineWithMessagesCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.LifelineCopyableProperties;
import com.eclipsesource.uml.modelserver.commands.communication.message.MessageCopyableProperties;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;

public class UmlPasteOperationHandler
   extends EMSBasicOperationHandler<PasteOperation, UmlModelServerAccess> {
   private final static String ARG_LAST_CONTAINABLE_ID = "lastContainableId";
   private static final int DEFAULT_OFFSET = 20;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected ActionDispatcher actionDispatcher;

   protected final Gson gson;

   @Inject
   public UmlPasteOperationHandler(final GraphGsonConfigurationFactory gsonConfigurator) {
      GsonBuilder builder = gsonConfigurator.configureGson();
      gson = builder.create();
   }

   @Override
   public void executeOperation(final PasteOperation operation,
      final UmlModelServerAccess modelServerAccess) {
      var selectedElements = getCopiedElements(
         operation.getClipboardData().get(UmlRequestClipboardDataActionHandler.CLIPBOARD_SELECTED_ELEMENTS));
      var interactionElements = UmlGModelUtil.filterByType(selectedElements, Types.INTERACTION, GModelElement.class)
         .collect(Collectors.toUnmodifiableList());

      if (interactionElements.size() > 0) {
         shift(interactionElements,
            computeOffset(interactionElements, operation.getEditorContext().getLastMousePosition()));
         var interactionProperties = getInteractionProperties(interactionElements);

         modelServerAccess.exec(CopyInteractionCommandContribution.create(interactionProperties));
      } else {
         var parentInteraction = modelState.getIndex()
            .getSemantic(operation.getEditorContext().getArgs().get(ARG_LAST_CONTAINABLE_ID), Interaction.class);

         if (parentInteraction.isPresent()) {
            var root = getCopiedElement(
               operation.getClipboardData().get(UmlRequestClipboardDataActionHandler.CLIPBOARD_ROOT));
            var lifelineElements = UmlGModelUtil.filterByType(selectedElements, Types.LIFELINE, GModelElement.class)
               .collect(Collectors.toUnmodifiableList());

            var lifelineProperties = getLifelineProperties(lifelineElements);
            var messageProperties = getMessageProperties(lifelineElements, root);

            modelServerAccess
               .exec(CopyLifelineWithMessagesCommandContribution.create(
                  lifelineProperties,
                  messageProperties,
                  parentInteraction.get()));
         }
      }
   }

   protected ArrayList<GModelElement> getCopiedElements(final String jsonString) {
      return new ArrayList<>(Arrays.asList(gson.fromJson(jsonString, GModelElement[].class)));
   }

   protected GModelElement getCopiedElement(final String jsonString) {
      return gson.fromJson(jsonString, GModelElement.class);
   }

   protected List<InteractionCopyableProperties> getInteractionProperties(final List<GModelElement> elements) {
      return UmlGModelUtil.filterByType(elements, Types.INTERACTION, GNode.class)
         .map(interaction -> InteractionPropertiesFactory.from(interaction))
         .collect(Collectors.toUnmodifiableList());
   }

   protected List<LifelineCopyableProperties> getLifelineProperties(final List<GModelElement> elements) {
      return UmlGModelUtil.filterByType(elements, Types.LIFELINE, GNode.class)
         .map(lifeline -> LifelinePropertiesFactory.from(lifeline))
         .collect(Collectors.toUnmodifiableList());
   }

   protected List<MessageCopyableProperties> getMessageProperties(final List<GModelElement> elements,
      final GModelElement root) {
      var lifelineMappings = UmlGModelUtil.filterByType(elements, Types.LIFELINE, GNode.class)
         .collect(Collectors.toUnmodifiableMap(value -> value.getId(), value -> value));

      return UmlGModelUtil.flatFilterByType(root, Types.MESSAGE, GEdge.class)
         .filter(edge -> lifelineMappings.containsKey(edge.getSourceId())
            && lifelineMappings.containsKey(edge.getTargetId()))
         .map(message -> MessagePropertiesFactory.from(message))
         .collect(Collectors.toUnmodifiableList());
   }

   protected GPoint computeOffset(final List<GModelElement> elements, final Optional<GPoint> lastMousePosition) {
      GPoint offset = new GPointImpl();
      offset.setX(DEFAULT_OFFSET);
      offset.setY(DEFAULT_OFFSET);
      if (lastMousePosition.isPresent()) {
         Optional<GBoundsAware> referenceElement = getReferenceElementForPasteOffset(elements);
         if (referenceElement.isPresent()) {
            offset.setX(lastMousePosition.get().getX() - referenceElement.get().getPosition().getX());
            offset.setY(lastMousePosition.get().getY() - referenceElement.get().getPosition().getY());
         }
      }
      return offset;
   }

   protected Optional<GBoundsAware> getReferenceElementForPasteOffset(final List<GModelElement> elements) {
      double minY = Double.MAX_VALUE;
      // use top most element as a reference for the offset by default
      for (GModelElement element : elements) {
         if (element instanceof GBoundsAware) {
            GBoundsAware boundsAware = (GBoundsAware) element;
            if (minY > boundsAware.getPosition().getY()) {
               minY = boundsAware.getPosition().getY();
               return Optional.of(boundsAware);
            }
         }
      }
      return Optional.empty();
   }
}

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
package com.eclipsesource.uml.glsp.features.copy_paste.operations;

public class UmlPasteOperationHandler {/*-
   extends AbstractEMSOperationHandler<PasteOperation> {
   private final static String ARG_LAST_CONTAINABLE_ID = "lastContainableId";
   private static final int DEFAULT_OFFSET = 20;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected ActionDispatcher actionDispatcher;

   protected final Gson gson;

   @Inject
   public UmlPasteOperationHandler(final GraphGsonConfigurationFactory gsonConfigurator) {
      GsonBuilder builder = gsonConfigurator.configureGson();
      gson = builder.create();
   }

   @Override
   public void executeOperation(final PasteOperation operation) {
      /*-
      var selectedElements = getCopiedElements(
         operation.getClipboardData().get(UmlRequestClipboardDataActionHandler.CLIPBOARD_SELECTED_ELEMENTS));
      var interactionElements = GModelFilterUtil
         .filterByType(selectedElements, UmlCommunication_Interaction.TYPE_ID, GModelElement.class)
         .collect(Collectors.toUnmodifiableList());

      if (interactionElements.size() > 0) {
         shift(interactionElements,
            computeOffset(interactionElements, operation.getEditorContext().getLastMousePosition()));
         var interactionProperties = getInteractionProperties(interactionElements);

         modelServerAccess.exec(CopyInteractionCommandContribution.create(interactionProperties));
      } else {
         var parentInteraction = modelState.getIndex()
            .getEObject(operation.getEditorContext().getArgs().get(ARG_LAST_CONTAINABLE_ID), Interaction.class);

         if (parentInteraction.isPresent()) {
            var root = getCopiedElement(
               operation.getClipboardData().get(UmlRequestClipboardDataActionHandler.CLIPBOARD_ROOT));
            var lifelineElements = GModelFilterUtil
               .filterByType(selectedElements, UmlCommunication_Lifeline.TYPE_ID, GModelElement.class)
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
      *
   }

   protected ArrayList<GModelElement> getCopiedElements(final String jsonString) {
      return new ArrayList<>(Arrays.asList(gson.fromJson(jsonString, GModelElement[].class)));
   }

   protected GModelElement getCopiedElement(final String jsonString) {
      return gson.fromJson(jsonString, GModelElement.class);
   }

   protected List<InteractionCopyableProperties> getInteractionProperties(final List<GModelElement> elements) {
      return GModelFilterUtil.filterByType(elements, UmlCommunication_Interaction.TYPE_ID, GNode.class)
         .map(interaction -> InteractionPropertiesFactory.from(interaction))
         .collect(Collectors.toUnmodifiableList());
   }

   protected List<LifelineCopyableProperties> getLifelineProperties(final List<GModelElement> elements) {
      return GModelFilterUtil.filterByType(elements, UmlCommunication_Lifeline.TYPE_ID, GNode.class)
         .map(lifeline -> LifelinePropertiesFactory.from(lifeline))
         .collect(Collectors.toUnmodifiableList());
   }

   protected List<MessageCopyableProperties> getMessageProperties(final List<GModelElement> elements,
      final GModelElement root) {
      var lifelineMappings = GModelFilterUtil.filterByType(elements, UmlCommunication_Lifeline.TYPE_ID, GNode.class)
         .collect(Collectors.toUnmodifiableMap(value -> value.getId(), value -> value));

      return GModelFilterUtil.flatFilterByType(root, UmlCommunication_Message.TYPE_ID, GEdge.class)
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
   */
}

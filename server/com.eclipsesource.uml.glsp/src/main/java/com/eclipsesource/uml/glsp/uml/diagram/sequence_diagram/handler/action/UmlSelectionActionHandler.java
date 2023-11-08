/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.AbstractEMSActionHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.SelectAction;
import org.eclipse.glsp.server.emf.EMFModelIndex;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.InteractionFragment;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageEnd;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;
import org.eclipse.uml2.uml.MessageSort;
import org.eclipse.uml2.uml.OccurrenceSpecification;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.DiagramElementPropertyMapperRegistry;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.google.inject.Inject;

public class UmlSelectionActionHandler extends AbstractEMSActionHandler<SelectAction> {

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected DiagramElementPropertyMapperRegistry registry;

   @Override
   public List<Action> executeAction(final SelectAction action) {

      List<String> selectedElementsIds = action.getSelectedElementsIDs();
      List<String> checkedElementIDs = new ArrayList<>();

      var currentModelIndex = modelState.getIndex();

      // TODO: reactivate only with ALT!
      boolean semanticSelectDisabled = false;
      if (semanticSelectDisabled) {
         return listOf();
      }

      List<String> addToSelectionIDs = collectElements(0, selectedElementsIds, checkedElementIDs, currentModelIndex);

      if (addToSelectionIDs.isEmpty()) {
         return listOf();
      }

      System.out.println("add size: " + addToSelectionIDs.size());
      addToSelectionIDs.addAll(selectedElementsIds);
      return listOf(new SelectAction(addToSelectionIDs));
   }

   /**
    * Method collects elements to be additionally selected, based on semantics and their position.
    * All element happening after the originally selected element along the temporal dimension is selected.
    *
    * @param selectedElementsIds
    * @param currentModelIndex
    */
   private List<String> collectElements(final int i, final List<String> selectedElementsIds,
      final List<String> checkedElementIDs,
      final EMFModelIndex currentModelIndex) {

      List<String> addToSelectionIDs = new ArrayList<>();
      selectedElementsIds.removeIf(t -> t == null);

      for (String elementId : selectedElementsIds) {

         if (checkedElementIDs.contains(elementId)) {
            continue;
         }

         checkedElementIDs.add(elementId);

         System.out.println("selecting: " + elementId);
         var semanticElement = currentModelIndex.getEObject(elementId).get();
         if (semanticElement == null) {
            continue;
         }
         if (semanticElement instanceof Message) {
            checkElement(addToSelectionIDs, (Message) semanticElement);
            continue;
         }
         if (semanticElement instanceof Lifeline) {
            checkElement(addToSelectionIDs, (Lifeline) semanticElement);
            continue;
         }
         if (semanticElement instanceof OccurrenceSpecification) {
            checkElement(addToSelectionIDs, (OccurrenceSpecification) semanticElement);
            continue;
         }
      }

      selectedElementsIds.addAll(addToSelectionIDs);
      removeDuplicates(selectedElementsIds);
      removeDuplicates(checkedElementIDs);

      if (checkedElementIDs.containsAll(selectedElementsIds)) {
         return new ArrayList<>();
      }

      selectedElementsIds.addAll(collectElements(i + 1, selectedElementsIds, checkedElementIDs, currentModelIndex));

      removeDuplicates(selectedElementsIds);
      return selectedElementsIds;
   }

   /**
    * @param addToSelectionIDs
    * @param semanticElement
    */
   private void checkElement(final List<String> addToSelectionIDs, final OccurrenceSpecification semanticElement) {

      if (semanticElement instanceof MessageOccurrenceSpecification
         && ((MessageOccurrenceSpecification) semanticElement).getMessage()
            .getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL
         && ((MessageOccurrenceSpecification) semanticElement).getMessage()
            .getReceiveEvent() == semanticElement) {

         var createdLifelineId = SemanticElementAccessor
            .getId(((MessageOccurrenceSpecification) semanticElement).getCovered());
         addToSelectionIDs.add(createdLifelineId);

      } else {

         getPositionfShape(semanticElement).ifPresent(refPosition -> {
            var onSameLifeline = semanticElement.getCovered().getCoveredBys();
            addToSelectionIDs.addAll(
               onSameLifeline.stream()
                  // .filter(elem -> !selectedElementsIds.contains(SemanticElementAccessor.getId(elem)))
                  .filter(elem -> !addToSelectionIDs.contains(SemanticElementAccessor.getId(elem)))
                  .filter(elem -> getPositionfShape(elem).isPresent())
                  .filter(elem -> getPositionfShape(elem).get().getY() >= refPosition.getY())
                  // .filter(elem -> getPositionfShape(elem).get().getX() >= refPosition.getX())
                  .map(elem -> SemanticElementAccessor.getId(elem))
                  .collect(Collectors.toList()));
         });

         if (semanticElement instanceof MessageEnd) {
            // TODO: fix LOST and FOUND messages
            // TODO: handle CREATE messages

            var messageEnd = ((MessageEnd) semanticElement).oppositeEnd().get(0);
            var messageEndId = SemanticElementAccessor.getId(messageEnd);
            getPositionfShape(semanticElement).ifPresent(refPosition -> {
               if (getPositionfShape(messageEnd).get().getY() >= refPosition.getY()) {
                  addToSelectionIDs.add(messageEndId);
               }
            });

         }
      }
   }

   /**
    * @param addToSelectionIDs
    * @param semanticElement
    */
   private void checkElement(final List<String> addToSelectionIDs, final Lifeline semanticElement) {
      for (InteractionFragment fragment : semanticElement.getCoveredBys()) {
         System.out.println("adding: " + fragment.getName());
         addToSelectionIDs.add(SemanticElementAccessor.getId(fragment));
      }
   }

   /**
    * @param addToSelectionIDs
    * @param semanticElement
    */
   private void checkElement(final List<String> addToSelectionIDs, final Message semanticElement) {
      var sendEnd = semanticElement.getSendEvent();
      var receiveEnd = semanticElement.getReceiveEvent();

      if (sendEnd != null) {
         addToSelectionIDs.add(SemanticElementAccessor.getId(sendEnd));
      }
      if (receiveEnd != null) {
         addToSelectionIDs.add(SemanticElementAccessor.getId(receiveEnd));
      }
   }

   /**
    * @param dirtyList
    */
   private void removeDuplicates(final List<String> dirtyList) {
      var temp = dirtyList.stream().distinct().collect(Collectors.toList());
      dirtyList.clear();
      dirtyList.addAll(temp);
   }

   private Optional<GPoint> getPositionfShape(final EObject semanticElement) {
      var id = SemanticElementAccessor.getId(semanticElement);
      if (id != null) {
         var searchedElem = modelServerAccess.getNotationModel().getElements()
            .stream().filter(e -> e instanceof Shape)
            .map(e -> (Shape) e)
            .filter(e -> e.getSemanticElement().getElementId().equals(id))
            .findFirst();

         if (searchedElem.isPresent()) {
            var position = searchedElem.get().getPosition();
            return Optional.ofNullable(position);
         }
      }
      return null;
   }

}

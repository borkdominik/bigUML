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

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.operations.CutOperation;
import org.eclipse.glsp.server.operations.DeleteOperation;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.gmodel.GModelFilterUtil;
import com.eclipsesource.uml.glsp.diagram.communication_diagram.constants.CommunicationTypes;
import com.google.inject.Inject;

public class UmlCutOperationHandler
   extends AbstractEMSOperationHandler<CutOperation> {
   private final List<String> ignoreList = List.of(CommunicationTypes.MESSAGE);

   @Inject
   protected ActionDispatcher actionDispatcher;

   @Inject
   protected UmlModelState modelState;

   @Override
   public void executeOperation(final CutOperation operation) {
      List<String> cutableElementIds = getElementToCut(operation);
      if (!cutableElementIds.isEmpty()) {
         actionDispatcher.dispatch(new DeleteOperation(cutableElementIds));
      }
   }

   protected List<String> getElementToCut(final CutOperation cutAction) {
      var elementIds = cutAction.getEditorContext().getSelectedElementIds();
      var index = modelState.getIndex();
      var selectedElements = index.getAll(elementIds);

      var interactionIds = GModelFilterUtil
         .filterByType(selectedElements, CommunicationTypes.INTERACTION, GModelElement.class)
         .map(element -> element.getId())
         .collect(Collectors.toUnmodifiableList());

      if (interactionIds.size() > 0) {
         return interactionIds;
      }

      return selectedElements.stream().filter(element -> !ignoreList.contains(element.getType()))
         .map(element -> element.getId())
         .collect(Collectors.toUnmodifiableList());
   }
}

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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.gson.GraphGsonConfigurationFactory;
import org.eclipse.glsp.server.operations.PasteOperation;
import org.eclipse.glsp.server.types.EditorContext;

import com.eclipsesource.uml.glsp.core.handler.action.UmlRequestClipboardDataActionHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.core.commands.paste.UmlPasteContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class UmlPasteOperationHandler
   extends EMSOperationHandler<PasteOperation> {

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
      var representation = modelState.getUnsafeRepresentation();

      // TODO: Enable for all diagrams
      if (representation == Representation.USE_CASE) {
         var selectedElements = getCopiedElements(
            operation.getClipboardData().get(UmlRequestClipboardDataActionHandler.CLIPBOARD_SELECTED_ELEMENTS));

         if (selectedElements.isEmpty()) {
            return;
         }

         executePaste(selectedElements, operation.getEditorContext());
      }
   }

   public void executePaste(final List<GModelElement> selectedElements, final EditorContext context) {
      if (selectedElements.size() > 0) {
         selectedElements
            .forEach(selectedElm -> modelServerAccess.exec(UmlPasteContribution.create(selectedElm.getId())));
      }
   }

   protected List<GModelElement> getCopiedElements(final String jsonString) {
      GModelElement[] elements = gson.fromJson(jsonString, GModelElement[].class);
      return elements != null ? new ArrayList<>(Arrays.asList(elements)) : Collections.emptyList();
   }
}

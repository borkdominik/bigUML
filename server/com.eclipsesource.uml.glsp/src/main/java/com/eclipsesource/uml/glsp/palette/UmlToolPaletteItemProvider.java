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
package com.eclipsesource.uml.glsp.palette;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.operations.CreateNodeOperation;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class UmlToolPaletteItemProvider extends EMSBasicOperationHandler<CreateNodeOperation, UmlModelServerAccess>
   implements ToolPaletteItemProvider {

   private static Logger LOGGER = Logger.getLogger(UmlToolPaletteItemProvider.class.getSimpleName());

   @Inject
   private Set<DiagramPalette> diagramPaletteItemProviders;

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {

      Representation diagramType = UmlModelState.getModelState(getUmlModelState()).getNotationModel().getDiagramType();
      LOGGER.info("------- CURRENT DIAGRAM TYPE: " + diagramType + " ----------");

      var items = new ArrayList<PaletteItem>();

      diagramPaletteItemProviders.stream().filter(contribution -> contribution.supports(diagramType))
         .forEachOrdered(contribution -> {
            items.addAll(contribution.getItems(args));
         });

      return items;
   }

   // just part of the workaround which was used to get the current diagram type
   @Override
   public void executeOperation(final CreateNodeOperation createNodeOperation,
      final UmlModelServerAccess modelServerAccess) {}

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }
}

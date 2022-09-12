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
package com.eclipsesource.uml.glsp.actions;

import java.util.List;

import org.apache.log4j.Logger;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.outline.CommunicationOutlineGenerator;
import com.eclipsesource.uml.glsp.outline.DefaultOutlineGenerator;
import com.eclipsesource.uml.glsp.outline.OutlineTreeNode;
import com.google.inject.Inject;

public class UmlRequestOutlineHandler extends AbstractActionHandler<RequestOutlineAction> {

   private static final Logger LOG = Logger.getLogger(UmlRequestOutlineHandler.class);

   @Inject
   protected DefaultOutlineGenerator defaultOutlineGenerator;

   @Inject
   protected CommunicationOutlineGenerator communicationOutlineGenerator;

   @Inject
   protected UmlModelState modelState;

   @Override
   protected List<Action> executeAction(final RequestOutlineAction actualAction) {

      var diagramType = modelState.getNotationModel().getDiagramType();
      List<OutlineTreeNode> outlineTreeNodes = List.of();

      switch (diagramType) {
         case COMMUNICATION: {
            outlineTreeNodes = communicationOutlineGenerator.generate();
            break;
         }
         default:
            outlineTreeNodes = defaultOutlineGenerator.generate();
      }

      return List.of(new SetOutlineAction(outlineTreeNodes));
   }

}

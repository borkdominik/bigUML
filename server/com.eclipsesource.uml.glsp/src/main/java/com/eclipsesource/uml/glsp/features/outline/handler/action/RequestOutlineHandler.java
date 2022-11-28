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
package com.eclipsesource.uml.glsp.features.outline.handler.action;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.outline.generator.DefaultDiagramOutlineGenerator;
import com.google.inject.Inject;

public class RequestOutlineHandler extends AbstractActionHandler<RequestOutlineAction> {

   private static final Logger LOG = LogManager.getLogger(RequestOutlineHandler.class);

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected DiagramOutlineGeneratorRegistry registry;

   @Inject
   protected DefaultDiagramOutlineGenerator defaultGenerator;

   @Override
   protected List<Action> executeAction(final RequestOutlineAction actualAction) {
      return modelState.getRepresentation().map(representation -> {

         var generator = registry.get(representation).orElse(defaultGenerator);

         return List.<Action> of(new SetOutlineAction(generator.generate()));
      }).orElse(List.of());
   }
}

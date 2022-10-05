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
package com.eclipsesource.uml.glsp.features.outline.actions;

import java.util.List;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;

import com.eclipsesource.uml.glsp.features.outline.generator.DefaultOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.generator.DiagramOutlineGenerator;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.google.inject.Inject;

public class RequestOutlineHandler extends AbstractActionHandler<RequestOutlineAction> {

   private static final Logger LOG = LogManager.getLogger(RequestOutlineHandler.class);

   @Inject
   private DefaultOutlineGenerator defaultGenerator;

   @Inject
   private Set<DiagramOutlineGenerator> generators;

   @Inject
   protected UmlModelState modelState;

   @Override
   protected List<Action> executeAction(final RequestOutlineAction actualAction) {
      var diagramType = modelState.getRepresentation();

      var generator = generators.stream().filter(g -> g.supports(diagramType)).findFirst().orElse(defaultGenerator);

      return List.of(new SetOutlineAction(generator.generate()));
   }

}

/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.handler.action;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.internal.actions.DefaultActionHandlerRegistry;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.google.inject.Inject;

@SuppressWarnings("restriction")
public class UmlActionHandlerRegistry extends DefaultActionHandlerRegistry {
   protected UmlModelState modelState;
   protected UmlOverrideActionHandlerRegistry overrideRegistry;

   @Inject
   public UmlActionHandlerRegistry(final Set<ActionHandler> handlers, final UmlModelState modelState,
      final UmlOverrideActionHandlerRegistry overrideRegsitry) {
      super(handlers);

      this.modelState = modelState;
      this.overrideRegistry = overrideRegsitry;

   }

   @Override
   public List<ActionHandler> get(final Class<? extends Action> key) {
      var actionHandler = this.modelState.getRepresentation().flatMap(representation -> {
         var overrideKey = RepresentationKey.<Class<? extends Action>> of(representation,
            key);

         if (overrideRegistry.hasKey(overrideKey)) {
            return overrideRegistry.get(overrideKey);
         }

         return Optional.<List<ActionHandler>> empty();
      });

      return actionHandler.orElseGet(() -> super.get(key));
   }
}

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
package com.eclipsesource.uml.glsp.uml.features.property_palette;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateHandlerOperationMapper;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.uml.configuration.RepresentationElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public abstract class RepresentationElementPropertyMapper<TElement extends EObject>
   extends BaseDiagramElementPropertyMapper<TElement> implements RepresentationElementConfigurationAccessor {

   protected Representation representation;

   @Inject
   protected ElementConfigurationRegistry configurationRegistry;

   public RepresentationElementPropertyMapper(final Representation representation) {
      this.representation = representation;
   }

   @Override
   public Representation representation() {
      return representation;
   }

   @Override
   public ElementConfigurationRegistry configurationRegistry() {
      return configurationRegistry;
   }

   @Override
   protected <THandler extends DiagramUpdateHandler<TElement>, TUpdateArgument> UpdateHandlerOperationMapper.Prepared<THandler, TElement, TUpdateArgument> getHandler(
      final Class<THandler> handlerType, final UpdateElementPropertyAction action) {
      return handlerMapper.prepare(representation, handlerType, getElement(action));
   }

}

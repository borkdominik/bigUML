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
package com.eclipsesource.uml.glsp.uml.features.label_edit;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;

import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateHandlerOperationMapper;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public abstract class RepresentationLabelEditMapper<TElement extends EObject>
   extends BaseLabelEditMapper<TElement> implements ElementConfigurationAccessor {

   protected Representation representation;

   @Inject
   protected ElementConfigurationRegistry configurationRegistry;

   public RepresentationLabelEditMapper(final Representation representation) {
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
      final Class<THandler> handlerType, final ApplyLabelEditOperation operation) {
      return handlerMapper.prepare(representation, handlerType,
         labelExtractor.extractElement(operation, this.elementType));
   }
}

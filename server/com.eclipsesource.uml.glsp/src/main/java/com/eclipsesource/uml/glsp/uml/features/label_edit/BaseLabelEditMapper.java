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
package com.eclipsesource.uml.glsp.uml.features.label_edit;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;

import com.eclipsesource.uml.glsp.core.features.label_edit.ApplyLabelEditOperationLabelExtractor;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateHandlerOperationMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.PropertyPaletteFeatureManifest;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class BaseLabelEditMapper<TElement extends EObject>
   implements DiagramLabelEditMapper<TElement> {
   protected final Class<TElement> elementType;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected ApplyLabelEditOperationLabelExtractor labelExtractor;

   @Inject
   protected UpdateHandlerOperationMapper handlerMapper;

   public BaseLabelEditMapper() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseLabelEditMapper.class, 0);
   }

   @Override
   public Class<TElement> getElementType() { return elementType; }

   protected <THandler extends DiagramUpdateHandler<TElement>, TUpdateArgument> UpdateHandlerOperationMapper.Prepared<THandler, TElement, TUpdateArgument> getHandler(
      final Class<THandler> handlerType, final ApplyLabelEditOperation operation) {
      return handlerMapper.prepare(handlerType, labelExtractor.extractElement(operation, this.elementType));
   }

   protected boolean matches(final ApplyLabelEditOperation operation, final String type, final String suffix) {
      var extractedLabel = labelExtractor.extractLabel(operation);
      var extractedSuffix = labelExtractor.extractLabelSuffix(operation);

      return extractedLabel.getType().equals(type) && extractedSuffix.equals(suffix);
   }

   protected Optional<UpdateOperation> withContext(final UpdateOperation operation) {
      return Optional.ofNullable(operation).map(o -> {
         o.getContext().put("origin", PropertyPaletteFeatureManifest.ID);
         return o;
      });
   }
}

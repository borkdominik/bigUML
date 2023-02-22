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

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateHandlerOperationMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.PropertyPaletteFeatureManifest;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyBuilder;
import com.google.gson.Gson;
import com.google.inject.Inject;

public abstract class BaseDiagramElementPropertyMapper<TElement extends EObject>
   implements DiagramElementPropertyMapper<TElement> {

   protected final Class<TElement> elementType;

   protected final Gson gson;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   protected UpdateHandlerOperationMapper handlerMapper;

   public BaseDiagramElementPropertyMapper() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseDiagramElementPropertyMapper.class, 0);

      this.gson = new Gson();
   }

   @Override
   public Class<TElement> getElementType() { return elementType; }

   protected <TProperty extends Enum<TProperty>> ElementPropertyBuilder<TProperty> propertyBuilder(
      final Class<TProperty> property,
      final String elementId) {
      return new ElementPropertyBuilder<>(elementId);
   }

   protected <THandler extends DiagramUpdateHandler<TElement, TUpdateArgument>, TUpdateArgument> UpdateHandlerOperationMapper.Prepared<THandler, TElement, TUpdateArgument> getHandler(
      final Class<THandler> handlerType, final UpdateElementPropertyAction action) {
      return handlerMapper.prepare(handlerType, getElement(action));
   }

   protected TElement getElement(final UpdateElementPropertyAction action) {
      var elementId = action.getElementId();
      return getOrThrow(modelState.getIndex().getEObject(elementId),
         elementType,
         "Could not find semantic element for id '" + elementId
            + "' in " + this.getClass().getSimpleName() + " .");
   }

   protected <TProperty extends Enum<TProperty>> TProperty getProperty(
      final Class<TProperty> propertyType, final UpdateElementPropertyAction action) {
      return Enum.valueOf(propertyType, action.getPropertyId());
   }

   protected Optional<UpdateOperation> withContext(final UpdateOperation operation) {
      return Optional.ofNullable(operation).map(o -> {
         o.getContext().put("origin", PropertyPaletteFeatureManifest.ID);
         return o;
      });
   }
}

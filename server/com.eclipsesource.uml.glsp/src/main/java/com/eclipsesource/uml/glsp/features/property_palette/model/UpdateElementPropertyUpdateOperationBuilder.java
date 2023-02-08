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
package com.eclipsesource.uml.glsp.features.property_palette.model;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiFunction;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.PropertyPaletteFeatureManifest;

public class UpdateElementPropertyUpdateOperationBuilder<TElementType extends EObject> {
   protected final Class<TElementType> elementType;

   protected Map<String, BiFunction<TElementType, UpdateElementPropertyAction, UpdateOperation>> items = new HashMap<>();
   protected Map<String, String> context;

   protected UmlModelState modelState;

   public UpdateElementPropertyUpdateOperationBuilder(final UmlModelState modelState, final Class<TElementType> clazz) {
      this(modelState, new HashMap<>(), clazz);
   }

   public UpdateElementPropertyUpdateOperationBuilder(final UmlModelState modelState,
      final Map<String, String> context, final Class<TElementType> clazz) {
      this.modelState = modelState;

      this.context = context;
      this.context.put("origin", PropertyPaletteFeatureManifest.ID);

      this.elementType = clazz;
   }

   public UpdateElementPropertyUpdateOperationBuilder<TElementType> map(final String propertyId,
      final BiFunction<TElementType, UpdateElementPropertyAction, UpdateOperation> provider) {
      this.items.merge(propertyId, provider, (v1, v2) -> {
         throw new IllegalArgumentException("Duplicate key '" + propertyId + "'.");
      });
      return this;
   }

   public Optional<UpdateOperation> find(final UpdateElementPropertyAction action) {
      return Optional.ofNullable(items.get(action.getPropertyId()))
         .map(f -> {
            var elementId = action.getElementId();
            var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
               elementType,
               "Could not find semantic element for id '" + elementId
                  + "', no mapping for update element property executed.");

            var operation = f.apply(semanticElement, action);

            operation.getContext().putAll(this.context);

            return operation;
         });
   }
}

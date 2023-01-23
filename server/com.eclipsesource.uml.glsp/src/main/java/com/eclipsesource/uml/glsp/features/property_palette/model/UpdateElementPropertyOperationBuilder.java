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

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.PropertyPaletteFeatureManifest;

public class UpdateElementPropertyOperationBuilder {
   private final Map<String, Function<UpdateElementPropertyAction, UpdateOperation>> items = new HashMap<>();
   private final Map<String, String> context;

   public UpdateElementPropertyOperationBuilder() {
      this(new HashMap<>());
   }

   public UpdateElementPropertyOperationBuilder(final Map<String, String> context) {
      this.context = context;
      this.context.put("origin", PropertyPaletteFeatureManifest.ID);
   }

   public UpdateElementPropertyOperationBuilder operation(final String propertyId,
      final Function<UpdateElementPropertyAction, UpdateOperation> provider) {
      this.items.put(propertyId, provider);
      return this;
   }

   public Optional<UpdateOperation> find(final UpdateElementPropertyAction action) {
      return Optional.ofNullable(items.get(action.getPropertyId()))
         .map(f -> {
            var operation = f.apply(action);

            operation.getContext().putAll(this.context);

            return operation;
         });
   }
}

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
package com.eclipsesource.uml.glsp.core.features.label_edit;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiFunction;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;

public class ApplyLabelEditUpdateOperationBuilder<TElementType extends EObject> {
   protected final Class<TElementType> elementType;

   protected Map<String, Map<String, BiFunction<TElementType, ApplyLabelEditOperation, UpdateOperation>>> items = new HashMap<>();
   protected Map<String, String> context;

   protected UmlModelState modelState;
   protected Suffix suffix;

   public ApplyLabelEditUpdateOperationBuilder(final UmlModelState modelState, final Suffix suffix,
      final Class<TElementType> clazz) {
      this(modelState, suffix, new HashMap<>(), clazz);
   }

   public ApplyLabelEditUpdateOperationBuilder(final UmlModelState modelState, final Suffix suffix,
      final Map<String, String> context, final Class<TElementType> clazz) {
      this.modelState = modelState;
      this.suffix = suffix;

      this.context = context;
      this.context.put("origin", "root");

      this.elementType = clazz;
   }

   public ApplyLabelEditUpdateOperationBuilder<TElementType> map(final String type, final String suffix,
      final BiFunction<TElementType, ApplyLabelEditOperation, UpdateOperation> provider) {
      this.items.putIfAbsent(type, new HashMap<>());
      this.items.get(type).put(suffix, provider);

      return this;
   }

   public Optional<UpdateOperation> find(final ApplyLabelEditOperation operation) {
      return Optional.ofNullable(items.get(this.extractLabelType(operation)))
         .map(f -> {
            return f.get(this.extractLabelSuffix(operation));
         })
         .map(f -> {
            var elementId = this.extractElementId(operation);
            var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
               elementType,
               "Could not find semantic element for id '" + elementId + "', no mapping for edit label executed.");

            var updateOperation = f.apply(semanticElement, operation);

            updateOperation.getContext().putAll(this.context);

            return updateOperation;
         });
   }

   protected String extractElementId(final ApplyLabelEditOperation operation) {
      var labelId = operation.getLabelId();
      return suffix.extractId(labelId)
         .orElseThrow(() -> new GLSPServerException("No elementId found by extractor for label " + labelId));
   }

   protected String extractLabelType(final ApplyLabelEditOperation operation) {
      var labelId = operation.getLabelId();
      var label = getOrThrow(modelState.getIndex().get(labelId),
         GLabel.class, "No GLabel found for label " + labelId);
      return label.getType();
   }

   protected String extractLabelSuffix(final ApplyLabelEditOperation operation) {
      var labelId = operation.getLabelId();
      return suffix.extractSuffix(labelId)
         .orElseThrow(() -> new GLSPServerException("No suffix found by extractor for label " + labelId));

   }
}

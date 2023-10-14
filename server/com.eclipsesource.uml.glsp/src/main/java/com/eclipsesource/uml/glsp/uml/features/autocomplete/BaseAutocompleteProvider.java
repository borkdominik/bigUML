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
package com.eclipsesource.uml.glsp.uml.features.autocomplete;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.types.EditorContext;

import com.eclipsesource.uml.glsp.core.features.label_edit.LabelExtractor;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperationMapper;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.features.autocomplete.constants.AutocompleteConstants;
import com.eclipsesource.uml.glsp.features.autocomplete.provider.DiagramAutocompleteEntriesProvider;
import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class BaseAutocompleteProvider<TElement extends EObject> implements DiagramAutocompleteEntriesProvider {

   @Inject
   protected TypeLiteral<TElement> elementType;
   @Inject
   protected LabelExtractor labelExtractor;
   @Inject
   protected UmlModelState modelState;
   @Inject
   protected UpdateOperationMapper updateOperation;

   @Override
   public boolean handles(final EditorContext context) {
      return element(context).isPresent();
   }

   protected Optional<String> elementId(final EditorContext context) {
      return Optional.ofNullable(context.getArgs().get(AutocompleteConstants.EDITOR_CONTEXT_LABEL_ID))
         .map(labelId -> labelExtractor.extractElementId(labelId));
   }

   protected Optional<TElement> element(final EditorContext context) {
      return elementId(context).flatMap(id -> modelState.getIndex().getEObject(id, Type.clazz(elementType)));
   }

   protected UpdateOperation asUpdateOperation(final EObject element, final Object argument) {
      return updateOperation.from(element, argument);
   }
}

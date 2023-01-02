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
package com.eclipsesource.uml.modelserver.shared.codec.codecs;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.eclipsesource.uml.modelserver.shared.codec.ContextProvider;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public interface ElementCodec {

   interface Encoder<T> extends CCommandProvider {
      default T element(final EObject element) {
         ccommand().getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(element));
         return (T) this;
      }

      default T element(final String elementId) {
         ccommand().getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID, elementId);
         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider, ContextProvider {
      default <T> Optional<T> element(final Class<T> clazz) {
         var elementId = elementId();

         if (elementId.isEmpty()) {
            return Optional.empty();
         }

         return new SemanticElementAccessor(context()).getElement(elementId.get(), clazz);
      }

      default Optional<String> elementId() {
         return Optional.of(ccommand().getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID));
      }
   }
}

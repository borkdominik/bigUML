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
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public interface EdgeCodec {
   String SOURCE_SEMANTIC_ELEMENT_ID = "source_semantic_element_id";
   String TARGET_SEMANTIC_ELEMENT_ID = "target_semantic_element_id";

   interface Encoder<T> extends CCommandProvider {
      default T source(final EObject parent) {
         ccommand().getProperties().put(EdgeCodec.SOURCE_SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(parent));
         return (T) this;
      }

      default T target(final EObject parent) {
         ccommand().getProperties().put(EdgeCodec.TARGET_SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(parent));
         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider, ContextProvider {
      default String sourceId() {
         return ccommand().getProperties().get(EdgeCodec.SOURCE_SEMANTIC_ELEMENT_ID);
      }

      default <T> Optional<T> source(final Class<T> clazz) {
         return new SemanticElementAccessor(context()).getElement(sourceId(), clazz);
      }

      default String targetId() {
         return ccommand().getProperties().get(EdgeCodec.TARGET_SEMANTIC_ELEMENT_ID);
      }

      default <T> Optional<T> target(final Class<T> clazz) {
         return new SemanticElementAccessor(context()).getElement(targetId(), clazz);
      }
   }
}

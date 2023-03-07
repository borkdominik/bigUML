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
package com.eclipsesource.uml.modelserver.core.codec;

import java.util.Optional;
import java.util.Set;

import org.eclipse.emfcloud.modelserver.common.codecs.Codec;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.CodecProvider;

import com.eclipsesource.uml.modelserver.core.routing.UmlModelServerPaths;

public class UmlCodecProvider implements CodecProvider {

   @Override
   public Set<String> getAllFormats() {
      return Set.of(UmlModelServerPaths.FORMAT_UML, UmlModelServerPaths.FORMAT_RAW_JSON);
   }

   @Override
   public int getPriority(final String modelUri, final String format) {
      return getAllFormats().contains(format) ? 10 : NOT_SUPPORTED;
   }

   @Override
   public Optional<Codec> getCodec(final String modelUri, final String format) {
      if (format.equals(UmlModelServerPaths.FORMAT_UML)) {
         return Optional.of(new UmlCodec());
      } else if (format.equals(UmlModelServerPaths.FORMAT_RAW_JSON)) {
         return Optional.of(new UmlRawJsonCodec());
      }

      return Optional.empty();
   }

}

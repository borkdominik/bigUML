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
package com.eclipsesource.uml.modelserver.codecs;

import java.util.Optional;
import java.util.Set;

import org.eclipse.emfcloud.modelserver.common.codecs.Codec;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.CodecProvider;

import com.eclipsesource.uml.modelserver.routing.UmlModelServerPaths;

public class UmlCodecProvider implements CodecProvider {

   @Override
   public Set<String> getAllFormats() { return Set.of(UmlModelServerPaths.FORMAT_UML); }

   @Override
   public int getPriority(final String modelUri, final String format) {
      return getAllFormats().contains(format) ? 10 : NOT_SUPPORTED;
   }

   @Override
   public Optional<Codec> getCodec(final String modelUri, final String format) {
      return Optional.of(new UmlCodec());
   }

}

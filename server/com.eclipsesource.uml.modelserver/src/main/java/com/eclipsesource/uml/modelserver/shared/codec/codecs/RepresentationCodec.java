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

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface RepresentationCodec {
   String REPRESENTATION = "representation";

   interface Encoder<T> extends CCommandProvider {
      default T representation(final Representation representation) {
         ccommand().getProperties().put(RepresentationCodec.REPRESENTATION, representation.getName());

         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider {
      default Optional<Representation> representation() {
         return Optional.ofNullable(ccommand().getProperties().get(RepresentationCodec.REPRESENTATION))
            .map(r -> Representation.valueOf(r));
      }
   }
}

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

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;

public interface ExtraCodec {

   interface Encoder<T> extends CCommandProvider {
      default T extra(final String key, final String value) {
         ccommand().getProperties().put(key, value);
         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider {
      default String extra(final String key) {
         return ccommand().getProperties().get(key);
      }
   }
}

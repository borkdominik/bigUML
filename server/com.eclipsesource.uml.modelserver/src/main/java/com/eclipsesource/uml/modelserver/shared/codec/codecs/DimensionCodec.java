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

import org.eclipse.glsp.graph.GDimension;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.eclipsesource.uml.modelserver.shared.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.shared.utils.UmlGraphUtil;

public interface DimensionCodec {

   interface Encoder<T> extends CCommandProvider {
      default T dimension(final GDimension dimension) {
         ccommand().getProperties().put(NotationKeys.WIDTH,
            String.valueOf(dimension.getWidth()));
         ccommand().getProperties().put(NotationKeys.HEIGHT,
            String.valueOf(dimension.getHeight()));

         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider {
      default Optional<GDimension> dimension() {
         var width = ccommand().getProperties().get(NotationKeys.WIDTH);
         var height = ccommand().getProperties().get(NotationKeys.HEIGHT);

         if (width != null && height != null) {
            return Optional.of(UmlGraphUtil.parseGDimension(width, height));
         }

         return Optional.empty();
      }
   }
}

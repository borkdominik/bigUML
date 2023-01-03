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

import org.eclipse.glsp.graph.GPoint;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.eclipsesource.uml.modelserver.shared.utils.UmlGraphUtil;

public interface PositionCodec {
   String POSITION_X = "positionX";
   String POSITION_Y = "positionY";

   interface Encoder<T> extends CCommandProvider {
      default T position(final GPoint position) {
         ccommand().getProperties().put(PositionCodec.POSITION_X,
            String.valueOf(position.getX()));
         ccommand().getProperties().put(PositionCodec.POSITION_Y,
            String.valueOf(position.getY()));

         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider {
      default Optional<GPoint> position() {
         var x = ccommand().getProperties().get(PositionCodec.POSITION_X);
         var y = ccommand().getProperties().get(PositionCodec.POSITION_Y);

         if (x != null && y != null) {
            return Optional.of(UmlGraphUtil.parseGPoint(x, y));
         }

         return Optional.empty();
      }
   }
}

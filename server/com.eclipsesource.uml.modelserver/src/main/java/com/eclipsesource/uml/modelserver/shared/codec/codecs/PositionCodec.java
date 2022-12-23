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

import org.eclipse.glsp.graph.GPoint;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.eclipsesource.uml.modelserver.shared.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.shared.utils.UmlGraphUtil;

public interface PositionCodec {

   interface Encoder<T> extends CCommandProvider {
      default T position(final GPoint position) {
         ccommand().getProperties().put(NotationKeys.POSITION_X,
            String.valueOf(position.getX()));
         ccommand().getProperties().put(NotationKeys.POSITION_Y,
            String.valueOf(position.getY()));

         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider {
      default GPoint position() {
         return UmlGraphUtil.getGPoint(
            ccommand().getProperties().get(NotationKeys.POSITION_X),
            ccommand().getProperties().get(NotationKeys.POSITION_Y));
      }
   }
}

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
package com.eclipsesource.uml.modelserver.core.manifest.contributions;

import org.eclipse.emfcloud.modelserver.edit.CommandContribution;

import com.google.inject.Binder;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;

public interface CommandCodecContribution {
   default void contributeCommandCodec(final Binder binder) {
      var provider = MapBinder.newMapBinder(binder, TypeLiteral.get(String.class),
         TypeLiteral.get(CommandContribution.class));
      contributeCommandCodec(provider);
   }

   void contributeCommandCodec(MapBinder<String, CommandContribution> multibinder);
}

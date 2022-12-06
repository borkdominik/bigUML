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
package com.eclipsesource.uml.glsp.core.manifest.contributions;

import java.util.function.Consumer;

import com.eclipsesource.uml.glsp.core.features.idgenerator.SuffixIdAppender;
import com.google.inject.Binder;
import com.google.inject.multibindings.MapBinder;

public interface SuffixIdAppenderContribution {

   default void contributeSuffixIdAppenders(final Binder binder,
      final Consumer<MapBinder<String, SuffixIdAppender>> consumer) {
      var mapbinder = MapBinder.newMapBinder(binder, String.class, SuffixIdAppender.class);

      consumer.accept(mapbinder);
   }

}

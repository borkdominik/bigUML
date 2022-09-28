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
package com.eclipsesource.uml.glsp.features.outline.manifest.contributions;

import com.eclipsesource.uml.glsp.features.outline.generator.DiagramOutlineGenerator;
import com.google.inject.Binder;
import com.google.inject.multibindings.Multibinder;

public interface OutlineGeneratorContribution {

   default void contributeOutlineGenerator(final Binder binder) {
      var provider = Multibinder.newSetBinder(binder, DiagramOutlineGenerator.class);
      contributeOutlineGenerator(provider);
   }

   void contributeOutlineGenerator(Multibinder<DiagramOutlineGenerator> multibinder);
}

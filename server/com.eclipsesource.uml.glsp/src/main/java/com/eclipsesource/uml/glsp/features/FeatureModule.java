/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features;

import com.eclipsesource.uml.glsp.features.outline.manifest.OutlineFeatureManifest;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.PropertyPaletteFeatureManifest;
import com.google.inject.AbstractModule;

public class FeatureModule extends AbstractModule {

   @Override
   protected void configure() {
      super.configure();

      install(new OutlineFeatureManifest());
      install(new PropertyPaletteFeatureManifest());
   }
}

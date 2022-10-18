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
package com.eclipsesource.uml.glsp.core.manifest;

import com.eclipsesource.uml.glsp.core.manifest.contributions.DiagramConfigurationContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.PaletteContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.GModelMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.TypeMappingContribution;
import com.google.inject.AbstractModule;

public abstract class DiagramManifest extends AbstractModule
   implements DiagramConfigurationContribution, PaletteContribution, GModelMapperContribution,
   TypeMappingContribution {

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramConfiguration(binder());
      contributePalette(binder());
      contributeGModelMapper(binder());
      contributeTypeMapping(binder());
   }
}

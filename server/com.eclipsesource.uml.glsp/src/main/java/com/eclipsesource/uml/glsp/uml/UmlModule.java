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
package com.eclipsesource.uml.glsp.uml;

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.manifest.CommunicationUmlManifest;
import com.eclipsesource.uml.glsp.uml.representation.class_diagram.ClassUmlManifest;
import com.eclipsesource.uml.glsp.uml.representation.use_case.UseCaseManifest;
import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

public class UmlModule extends AbstractModule {

   @Override
   protected void configure() {
      super.configure();

      bind(ElementConfigurationRegistry.class).in(Singleton.class);

      install(new ClassUmlManifest());
      install(new CommunicationUmlManifest());
      install(new UseCaseManifest());
      // install(new PackageManifest());
   }

}

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
import com.eclipsesource.uml.glsp.uml.representation.activity.ActivityUmlManifest;
import com.eclipsesource.uml.glsp.uml.representation.class_.ClassUmlManifest;
import com.eclipsesource.uml.glsp.uml.representation.communication.CommunicationUmlManifest;
import com.eclipsesource.uml.glsp.uml.representation.deployment.DeploymentUmlManifest;
import com.eclipsesource.uml.glsp.uml.representation.information_flow.InformationFlowUmlManifest;
import com.eclipsesource.uml.glsp.uml.representation.package_.PackageManifest;
import com.eclipsesource.uml.glsp.uml.representation.state_machine.StateMachineManifest;
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
      install(new PackageManifest());
      install(new StateMachineManifest());
      install(new DeploymentUmlManifest());
      install(new ActivityUmlManifest());
      install(new InformationFlowUmlManifest());
   }
}

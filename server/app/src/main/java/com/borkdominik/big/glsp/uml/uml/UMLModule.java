/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml;

import com.borkdominik.big.glsp.uml.uml.elements.type.TypeInformationProvider;
import com.borkdominik.big.glsp.uml.uml.representation.activity.UMLActivityManifest;
import com.borkdominik.big.glsp.uml.uml.representation.class_.UMLClassManifest;
import com.borkdominik.big.glsp.uml.uml.representation.communication.UMLCommunicationManifest;
import com.borkdominik.big.glsp.uml.uml.representation.deployment.UMLDeploymentManifest;
import com.borkdominik.big.glsp.uml.uml.representation.information_flow.UMLInformationFlowManifest;
import com.borkdominik.big.glsp.uml.uml.representation.package_.UMLPackageManifest;
import com.borkdominik.big.glsp.uml.uml.representation.state_machine.UMLStateMachineManifest;
import com.borkdominik.big.glsp.uml.uml.representation.use_case.UMLUseCaseManifest;
import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

public class UMLModule extends AbstractModule {

   @Override
   protected void configure() {
      super.configure();

      bind(TypeInformationProvider.class).in(Singleton.class);

      install(new UMLActivityManifest());
      install(new UMLClassManifest());
      install(new UMLCommunicationManifest());
      install(new UMLDeploymentManifest());
      install(new UMLInformationFlowManifest());
      install(new UMLPackageManifest());
      install(new UMLStateMachineManifest());
      install(new UMLUseCaseManifest());
   }
}

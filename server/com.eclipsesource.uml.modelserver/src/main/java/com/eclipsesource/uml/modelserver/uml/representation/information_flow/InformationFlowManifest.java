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
package com.eclipsesource.uml.modelserver.uml.representation.information_flow;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.uml.elements.actor.ActorDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.class_.ClassDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.information_flow.InformationFlowDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class InformationFlowManifest extends DiagramManifest {

   public InformationFlowManifest() {
      super(Representation.INFORMATION_FLOW);
   }

   @Override
   protected void configure() {
      super.configure();

      install(new ActorDefinitionModule(this));
      install(new ClassDefinitionModule(this));
      install(new InformationFlowDefinitionModule(this));
   }

}

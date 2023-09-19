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
package com.eclipsesource.uml.glsp.uml.representation.information_flow;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.elements.actor.ActorDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.class_.ClassDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.information_flow.InformationFlowDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class InformationFlowUmlManifest extends DiagramManifest {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.INFORMATION_FLOW;
   }

   @Override
   protected void configure() {
      super.configure();

      install(new ClassDefinitionModule(this));
      install(new ActorDefinitionModule(this));
      install(new InformationFlowDefinitionModule(this));

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(InformationFlowToolPaletteConfiguration.class);
      });

   }
}

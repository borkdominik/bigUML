/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.representation.communication;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.elements.interaction.InteractionDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.lifeline.LifelineDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.message.MessageDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class CommunicationUmlManifest extends DiagramManifest {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.COMMUNICATION;
   }

   @Override
   protected void configure() {
      super.configure();

      install(new InteractionDefinitionModule(this));
      install(new LifelineDefinitionModule(this));
      install(new MessageDefinitionModule(this));

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(CommunicationToolPaletteConfiguration.class);
      });

   }

}

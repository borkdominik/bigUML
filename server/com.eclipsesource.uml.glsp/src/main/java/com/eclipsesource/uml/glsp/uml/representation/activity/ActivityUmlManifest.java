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
package com.eclipsesource.uml.glsp.uml.representation.activity;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.elements.activity.ActivityDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.ActivityNodeDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.activity_partition.ActivityPartitionDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.control_flow.ControlFlowDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.pin.PinDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class ActivityUmlManifest extends DiagramManifest {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.ACTIVITY;
   }

   @Override
   protected void configure() {
      super.configure();

      install(new ActivityDefinitionModule(this));
      install(new ActivityNodeDefinitionModule(this));
      install(new ActivityPartitionDefinitionModule(this));
      install(new ControlFlowDefinitionModule(this));
      install(new PinDefinitionModule(this));

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(ActivityToolPaletteConfiguration.class);
      });

   }

}

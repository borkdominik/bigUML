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
package com.eclipsesource.uml.modelserver.uml.representation.activity;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.elements.activity.ActivityDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.activity_node.ActivityNodeDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.activity_partition.ActivityPartitionDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.control_flow.ControlFlowDefinitionModule;
import com.eclipsesource.uml.modelserver.uml.elements.pin.PinDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class ActivityManifest extends DiagramManifest implements CommandCodecContribution {
   public ActivityManifest() {
      super(Representation.ACTIVITY);
   }

   @Override
   protected void configure() {
      super.configure();
      install(new ActivityDefinitionModule(this));
      install(new ActivityNodeDefinitionModule(this));
      install(new ActivityPartitionDefinitionModule(this));
      install(new ControlFlowDefinitionModule(this));
      install(new PinDefinitionModule(this));
   }
}

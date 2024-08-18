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
package com.borkdominik.big.glsp.uml.uml.representation.activity;

import com.borkdominik.big.glsp.server.core.features.direct_editing.implementations.BGEMFDefaultDirectEditHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.delete.implementations.BGEMFDefaultDeleteHandler;
import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultReconnectElementHandler;
import com.borkdominik.big.glsp.uml.uml.elements.activity.ActivityElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.activity_node.ActivityNodeElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.activity_partition.ActivityPartitionElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.control_flow.ControlFlowElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.pin.PinElementManifest;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class UMLActivityManifest extends BGRepresentationManifest {

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

      bindToolPalette(ActivityToolPaletteProvider.class);
      bindDefaultDeleteOperation(BGEMFDefaultDeleteHandler.class);
      bindDefaultDirectEdit(BGEMFDefaultDirectEditHandler.class);
      bindDefaultReconnectOperation(UMLDefaultReconnectElementHandler.class);
      bindDefaultPropertyPalette(UMLDefaultPropertyPaletteProvider.class);

      install(new ActivityElementManifest(this));
      install(new ActivityNodeElementManifest(this));
      install(new ActivityPartitionElementManifest(this));
      install(new ControlFlowElementManifest(this));
      install(new PinElementManifest(this));
   }
}

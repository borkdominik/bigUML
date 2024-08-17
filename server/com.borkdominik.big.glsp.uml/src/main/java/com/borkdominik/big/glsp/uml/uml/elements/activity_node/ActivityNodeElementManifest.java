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
package com.borkdominik.big.glsp.uml.uml.elements.activity_node;

import java.util.Set;

import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.server.elements.manifest.integrations.BGEMFNodeElementManifest;
import com.borkdominik.big.glsp.server.features.property_palette.BGPropertyPaletteContribution;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.activity_node.gmodel.ActivityNodeGModelMapper;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementLabelEditHandler;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.NamedElementPropertyProvider;

public class ActivityNodeElementManifest extends BGEMFNodeElementManifest {
   public ActivityNodeElementManifest(final BGRepresentationManifest manifest) {
      super(manifest, Set.of(
         UMLTypes.ACTIVITY_NODE,
         UMLTypes.OPAQUE_ACTION,
         UMLTypes.ACCEPT_EVENT_ACTION,
         UMLTypes.SEND_SIGNAL_ACTION,
         UMLTypes.ACTIVITY_FINAL_NODE,
         UMLTypes.DECISION_NODE,
         UMLTypes.FORK_NODE,
         UMLTypes.INITIAL_NODE,
         UMLTypes.FLOW_FINAL_NODE,
         UMLTypes.JOIN_NODE,
         UMLTypes.MERGE_NODE,
         UMLTypes.ACTIVITY_PARAMETER_NODE,
         UMLTypes.CENTRAL_BUFFER_NODE));
   }

   @Override
   protected void configureElement() {
      bindGModelMapper(ActivityNodeGModelMapper.class);
      bindConfiguration(ActivityNodeConfiguration.class);
      bindCreateHandler(ActivityNodeOperationHandler.class);
      bindEditLabel(Set.of(NamedElementLabelEditHandler.class));
      bindPropertyPalette(BGPropertyPaletteContribution.Options.builder()
         .propertyProviders(Set.of(
            NamedElementPropertyProvider.class)));
   }
}

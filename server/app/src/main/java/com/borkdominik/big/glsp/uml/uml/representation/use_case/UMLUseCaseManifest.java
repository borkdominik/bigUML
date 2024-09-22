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
package com.borkdominik.big.glsp.uml.uml.representation.use_case;

import org.eclipse.emf.common.util.Enumerator;

import com.borkdominik.big.glsp.server.core.features.direct_editing.implementations.BGEMFDefaultDirectEditHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.delete.implementations.BGEMFDefaultDeleteHandler;
import com.borkdominik.big.glsp.server.core.manifest.BGRepresentationManifest;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultPropertyPaletteProvider;
import com.borkdominik.big.glsp.uml.uml.customizations.UMLDefaultReconnectElementHandler;
import com.borkdominik.big.glsp.uml.uml.elements.actor.ActorElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.component.ComponentElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.extend.ExtendElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.generalization.GeneralizationElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.include.IncludeElementManifest;
import com.borkdominik.big.glsp.uml.uml.elements.use_case.UseCaseElementManifest;
import com.borkdominik.big.glsp.uml.uml.representation.use_case.elements.association.UseCaseAssociationElementManifest;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class UMLUseCaseManifest extends BGRepresentationManifest {

   @Override
   public Enumerator representation() {
      return Representation.USE_CASE;
   }

   @Override
   protected void configure() {
      super.configure();

      bindToolPalette(UseCaseToolPaletteProvider.class);
      bindDefaultDeleteOperation(BGEMFDefaultDeleteHandler.class);
      bindDefaultDirectEdit(BGEMFDefaultDirectEditHandler.class);
      bindDefaultReconnectOperation(UMLDefaultReconnectElementHandler.class);
      bindDefaultPropertyPalette(UMLDefaultPropertyPaletteProvider.class);

      install(new ActorElementManifest(this));
      install(new UseCaseAssociationElementManifest(this));

      install(new ExtendElementManifest(this));
      install(new GeneralizationElementManifest(this));
      install(new IncludeElementManifest(this));
      install(new ComponentElementManifest(this));
      install(new UseCaseElementManifest(this));

   }
}

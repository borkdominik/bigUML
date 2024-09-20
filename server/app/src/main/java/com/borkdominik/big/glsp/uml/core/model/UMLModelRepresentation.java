/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.core.model;

import java.util.Optional;

import org.eclipse.emf.common.util.Enumerator;

import com.borkdominik.big.glsp.server.core.model.BGEMFModelState;
import com.borkdominik.big.glsp.server.core.model.BGModelRepresentation;
import com.borkdominik.big.glsp.uml.unotation.Representation;
import com.borkdominik.big.glsp.uml.unotation.UMLDiagram;
import com.google.inject.Inject;

public class UMLModelRepresentation implements BGModelRepresentation {

   @Inject
   protected BGEMFModelState modelState;

   @Override
   public Optional<Enumerator> get() {
      return modelState.getNotationModel(UMLDiagram.class)
         .map(umlDiagram -> Representation.getByName(umlDiagram.getDiagramType()));
   }

}

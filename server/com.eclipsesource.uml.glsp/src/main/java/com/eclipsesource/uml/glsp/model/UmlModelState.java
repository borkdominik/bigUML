/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.model;

import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelState;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;

// TODO: Make those getter better
public class UmlModelState extends EMSNotationModelState {
   public UmlDiagram getUmlNotationModel() {
      var model = super.getNotationModel(UmlDiagram.class);

      if (model.isEmpty()) {
         throw new GLSPServerException("Could not access UML Notation Model");
      }

      return model.get();
   }

   @Override
   public Model getSemanticModel() { return (Model) this.semanticModel; }

}

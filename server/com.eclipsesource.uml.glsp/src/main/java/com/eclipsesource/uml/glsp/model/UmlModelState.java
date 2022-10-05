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
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

// TODO: Make those getter better
public class UmlModelState extends EMSNotationModelState {
   public Diagram getUmlNotationModel() {
      var model = super.getNotationModel(Diagram.class);

      if (model.isEmpty()) {
         throw new GLSPServerException("Could not access UML Notation Model");
      }

      return model.get();
   }

   @Override
   public void updateRoot(final GModelRoot newRoot) {
      System.out.println("");
      System.out.println("UPDATE ROOT");
      System.out.println("");
      setRoot(newRoot);
      this.index = getOrUpdateIndex(newRoot);
   }

   public Representation getRepresentation() {
      return UmlNotationUtil.getRepresentation(this.getUmlNotationModel().getDiagramType());
   }

}

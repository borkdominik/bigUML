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
package com.eclipsesource.uml.glsp.core.model;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelState;
import org.eclipse.glsp.graph.GModelIndex;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;

public class UmlModelState extends EMSNotationModelState {

   @Override
   protected GModelIndex getOrUpdateIndex(final GModelRoot newRoot) {
      return UmlModelIndex.getOrCreate(getRoot(), semanticIdConverter);
   }

   public Optional<UmlDiagram> getUmlNotationModel() { return super.getNotationModel(UmlDiagram.class); }

   public UmlDiagram getUnsafeUmlNotationModel() {
      var model = getUmlNotationModel()
         .orElseThrow(() -> new GLSPServerException("Could not access UML Notation Model"));

      return model;
   }

   public Optional<Representation> getRepresentation() {
      return this.getUmlNotationModel().map(diagram -> diagram.getRepresentation());
   }

   public Representation getUnsafeRepresentation() { return this.getUnsafeUmlNotationModel().getRepresentation(); }

   public boolean hasNotation(final EObject element) {
      return getIndex().getNotation(element).isPresent();
   }

   public boolean hasSemantic(final String elementId) {
      return getIndex().getEObject(elementId).isPresent();
   }
}

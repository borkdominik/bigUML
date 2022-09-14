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
package com.eclipsesource.uml.glsp.model;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.modelserver.glsp.EMSModelServerAccess;
import org.eclipse.emfcloud.modelserver.glsp.model.EMSModelState;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.modelserver.unotation.Diagram;

public class UmlModelState extends EMSModelState {

   protected UmlModelServerAccess modelServerAccess;

   protected Model semanticModel;
   protected Diagram notationModel;

   public static UmlModelState getModelState(final GModelState state) {
      if (!(state instanceof UmlModelState)) {
         throw new IllegalArgumentException("Argument must be a ModelServer aware UmlModelState");
      }
      return ((UmlModelState) state);
   }

   public static UmlModelServerAccess getModelServerAccess(final GModelState state) {
      return getModelState(state).getModelServerAccess();
   }

   @Override
   public UmlModelServerAccess getModelServerAccess() { return modelServerAccess; }

   @Override
   protected void setModelServerAccess(final EMSModelServerAccess modelServerAccess) {
      this.modelServerAccess = (UmlModelServerAccess) modelServerAccess;
   }

   @Override
   public Diagram getNotationModel() { return notationModel; }

   @Override
   public Model getSemanticModel() { return semanticModel; }

   @Override
   public UmlModelIndex getIndex() { return UmlModelIndex.get(getRoot()); }

   @Override
   public void loadSourceModels() throws GLSPServerException {
      EObject semanticRoot = modelServerAccess.getSemanticModel();
      if (!(semanticRoot instanceof Model)) {
         throw new GLSPServerException("Error during semantic model loading");
      }
      this.semanticModel = (Model) semanticRoot;

      // initialize semantic model
      EcoreUtil.resolveAll(semanticModel);

      EObject notationRoot = modelServerAccess.getNotationModel();
      if (notationRoot != null && !(notationRoot instanceof Diagram)) {
         throw new GLSPServerException("Error during notation diagram loading");
      }
      this.notationModel = (Diagram) notationRoot;
   }

}

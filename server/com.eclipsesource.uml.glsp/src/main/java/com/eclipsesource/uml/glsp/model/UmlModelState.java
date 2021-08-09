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

import java.util.Map;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.model.GModelStateImpl;
import org.eclipse.glsp.server.protocol.GLSPServerException;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.gmodel.GModelFactory;
import com.eclipsesource.uml.glsp.gmodel.GModelFactoryProvider;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.modelserver.unotation.Diagram;

public class UmlModelState extends GModelStateImpl {

   private UmlModelServerAccess modelServerAccess;
   private GModelFactory gModelFactory;
   private UmlFacade umlFacade;
   private GModelRoot gModelRoot;

   public static UmlModelState getModelState(final GModelState state) {
      if (!(state instanceof UmlModelState)) {
         throw new IllegalArgumentException("Argument must be a ModelServer aware UmlModelState");
      }
      return ((UmlModelState) state);
   }

   public void initializeModelState(final Map<String, String> clientOptions,
      final UmlModelServerAccess modelServerAccess) {
      setClientOptions(clientOptions);
      setModelServerAccess(modelServerAccess);
      initializeUmlFacade();
      initializeGModelFactory();
      initializeGModelRoot();
   }

   public void refresh() {
      initializeUmlFacade();
      initializeGModelRoot();
   }

   private void initializeUmlFacade() {
      EObject semanticRoot = modelServerAccess.getModel();
      if (!(semanticRoot instanceof Model)) {
         throw new GLSPServerException("Error during UML model loading");
      }

      EObject notationRoot = modelServerAccess.getNotationModel();
      if (notationRoot != null && !(notationRoot instanceof Diagram)) {
         throw new GLSPServerException("Error during UML diagram loading");
      }
      // Clear modelIndex
      UmlModelIndex modelIndex = getIndex();
      modelIndex.clear();

      // If notationRoot is null it will be initialized in UmlFacade
      this.umlFacade = new UmlFacade((Model) semanticRoot, (Diagram) notationRoot, modelIndex);
   }

   public UmlFacade getUmlFacade() { return umlFacade; }

   public GModelFactory getGModelFactory() { return gModelFactory; }

   private void initializeGModelFactory() {
      this.gModelFactory = GModelFactoryProvider.get(this);
   }

   public static UmlModelServerAccess getModelServerAccess(final GModelState state) {
      return getModelState(state).getModelServerAccess();
   }

   private void setModelServerAccess(final UmlModelServerAccess modelServerAccess) {
      this.modelServerAccess = modelServerAccess;
   }

   public UmlModelServerAccess getModelServerAccess() { return modelServerAccess; }

   private void initializeGModelRoot() {
      GModelRoot gmodelRoot = gModelFactory.create();
      getUmlFacade().initialize(gmodelRoot);
      setRoot(gmodelRoot);
   }

   @Override
   public UmlModelIndex getIndex() { return UmlModelIndex.get(getRoot()); }

   @Override
   public GModelRoot getRoot() {
      if (gModelRoot == null) {
         GModelFactory.createRoot(this);
      }
      return gModelRoot;
   }

   @Override
   public void setRoot(final GModelRoot newRoot) {
      this.gModelRoot = newRoot;
      initializeCommandStack();
   }

}

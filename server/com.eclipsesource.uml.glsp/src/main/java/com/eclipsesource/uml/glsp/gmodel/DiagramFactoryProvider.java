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
package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class DiagramFactoryProvider {

   public static DiagramFactory get(final UmlModelState modelState) {
      //Representation diagramType = modelState.getUmlFacade().getDiagram().getDiagramType();
      Representation diagramType = modelState.getNotationModel().getDiagramType();
      switch (diagramType) {
         case CLASS: {
            return new UmlClassDiagramModelFactory(modelState);
         }
         case ACTIVITY: {
            return new UmlActivityDiagramModelFactory(modelState);
         }
         case USECASE: {
            return new UmlUseCaseDiagramModelFactory(modelState);
         }
         case DEPLOYMENT: {
            return new UmlDeploymentDiagramModelFactory(modelState);
         }
         case STATEMACHINE: {
            return new UmlStateMachineDiagramModelFactory(modelState);
         }
         case OBJECT: {
            return new UmlObjectDiagramModelFactory(modelState);
         }
      }
      return null;
   }

}

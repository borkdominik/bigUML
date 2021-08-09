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

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Diagram;

public class UmlClassDiagramModelFactory extends GModelFactory {

   public UmlClassDiagramModelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GGraph create(final Diagram umlDiagram) {
      GGraph graph = getOrCreateRoot();

      if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
         Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();

         graph.setId(toId(umlModel));

         // Add Classes
         List<GModelElement> classNodes = umlModel.getPackagedElements().stream()
            .filter(Class.class::isInstance)
            .map(Class.class::cast)
            .map(umlClass -> classifierNodeFactory.create(umlClass))
            .collect(Collectors.toList());
         graph.getChildren().addAll(classNodes);

         // Add Associations
         List<GModelElement> associationEdges = umlModel.getPackagedElements().stream()
            .filter(Association.class::isInstance)
            .map(Association.class::cast)
            .map(association -> relationshipEdgeFactory.create(association))
            .collect(Collectors.toList());
         graph.getChildren().addAll(associationEdges);

         // Add Enumerations
         List<GModelElement> enumerationNodes = umlModel.getPackagedElements().stream()
            .filter(Enumeration.class::isInstance)
            .map(Enumeration.class::cast)
            .map(umlEnumeration -> classifierNodeFactory.create(umlEnumeration))
            .collect(Collectors.toList());
         graph.getChildren().addAll(enumerationNodes);
      }
      return graph;

   }

}

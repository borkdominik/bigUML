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
package com.eclipsesource.uml.glsp.uml.class_diagram.gmodel;

import com.eclipsesource.uml.glsp.gmodel.DiagramFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Diagram;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.*;

import java.util.List;
import java.util.stream.Collectors;

public class UmlClassDiagramModelFactory extends DiagramFactory {

   public UmlClassDiagramModelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GGraph create(final Diagram umlDiagram) {
      GGraph graph = getOrCreateRoot();

      if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
         System.out.println("REACHES MODEL FACTORY");
         Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();

         graph.setId(toId(umlModel));

         // Add Classes
         List<GModelElement> classNodes = umlModel.getPackagedElements().stream()
               .filter(Class.class::isInstance)
               .map(Class.class::cast)
               .map(classDiagramNodeFactory::create)
               .collect(Collectors.toList());
         graph.getChildren().addAll(classNodes);

         // Add Interfaces
         List<GModelElement> interfaceNodes = umlModel.getPackagedElements().stream()
               .filter(Interface.class::isInstance)
               .map(Interface.class::cast)
               .map(classDiagramNodeFactory::create)
               .collect(Collectors.toList());
         graph.getChildren().addAll(interfaceNodes);

         // Add Enumerations
         List<GModelElement> enumerationNodes = umlModel.getPackagedElements().stream()
               .filter(Enumeration.class::isInstance)
               .map(Enumeration.class::cast)
               .map(classDiagramNodeFactory::create)
               .collect(Collectors.toList());
         graph.getChildren().addAll(enumerationNodes);

         // Add Generalisations
         List<GModelElement> generalisationEdges = umlModel.getPackagedElements().stream()
               .filter(Generalization.class::isInstance)
               .map(Generalization.class::cast)
               .map(classDiagramEdgeFactory::create)
               .collect(Collectors.toList());
         graph.getChildren().addAll(generalisationEdges);

         // Add Associations
         List<GModelElement> associationEdges = umlModel.getPackagedElements().stream()
               .filter(Association.class::isInstance)
               .map(Association.class::cast)
               .map(classDiagramEdgeFactory::create)
               .collect(Collectors.toList());
         graph.getChildren().addAll(associationEdges);

         // Add comments
         graph.getChildren().addAll(umlModel.getOwnedComments().stream()
               .flatMap(c -> commentFactory.create(c).stream())
               .collect(Collectors.toList()));
      }
      return graph;

   }

}

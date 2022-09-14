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
package com.eclipsesource.uml.glsp.uml.communication_diagram.gmodel;

import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.gmodel.DiagramFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Diagram;

public class UmlCommunicationDiagramModelFactory extends DiagramFactory {

   public UmlCommunicationDiagramModelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      GModelElement result = null;
      if (semanticElement instanceof Model) {
         result = create(semanticElement);
      } else if (semanticElement instanceof Interaction) {
         result = interactionNodeFactory.create((Interaction) semanticElement);
      } else if (semanticElement instanceof Lifeline) {
         result = lifelineNodeFactory.create((Lifeline) semanticElement);
      } else if (semanticElement instanceof Message) {
         result = messageEdgeFactory.create((Message) semanticElement);
      }

      if (result == null) {
         throw createFailed(semanticElement);
      }
      return result;
   }

   @Override
   public GGraph create(final Diagram umlDiagram) {
      GGraph graph = getOrCreateRoot();

      if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
         Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();

         graph.setId(toId(umlModel));

         graph.getChildren().addAll(umlModel.getPackagedElements().stream()
            .filter(Interaction.class::isInstance)
            .map(Interaction.class::cast)
            .map(this::create)
            .collect(Collectors.toSet()));
      }
      return graph;

   }

}

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
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.gmodel;

public class UmlActivityDiagramModelFactory { /*-

   public UmlActivityDiagramModelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      GModelElement result = null;
      if (semanticElement instanceof Model) {
         result = create(semanticElement);
      } else if (semanticElement instanceof Activity) {
         result = activityNodeFactory.create((Activity) semanticElement);
      } else if (semanticElement instanceof ActivityNode) {
         result = activityChildNodeFactory.create((ActivityNode) semanticElement);
      } else if (semanticElement instanceof ActivityEdge) {
         result = activityDiagramEdgeFactory.create((ActivityEdge) semanticElement);
      } else if (semanticElement instanceof ActivityGroup) {
         result = activityGroupNodeFactory.create((ActivityGroup) semanticElement);
      } else if (semanticElement instanceof ExceptionHandler) {
         result = activityDiagramEdgeFactory.create((ExceptionHandler) semanticElement);
      }

      return result;
   }

   /*
    * @Override
    * public GGraph create(final Diagram umlDiagram) {
    * GGraph graph = getOrCreateRoot();
    * if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
    * Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();
    * graph.setId(toId(umlModel));
    * graph.getChildren().addAll(umlModel.getPackagedElements().stream()
    * .filter(Activity.class::isInstance)
    * .map(Activity.class::cast)
    * .map(this::create)
    * .collect(Collectors.toSet()));
    * graph.getChildren().addAll(umlModel.getOwnedComments().stream()
    * .flatMap(c -> commentFactory.create(c).stream())
    * .collect(Collectors.toList()));
    * }
    * return graph;
    * }
    *
   */
}

package com.eclipsesource.uml.glsp.uml.object_diagram.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;

public class UmlObjectDiagramModelFactory extends ObjectDiagramFactory {

   public UmlObjectDiagramModelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   /*
    * @Override
    * public GGraph create(final Diagram umlDiagram) {
    * GGraph graph = getOrCreateRoot();
    * System.out.println("in model factory");
    * if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
    * Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();
    * graph.setId(toId(umlModel));
    * // Add Object Node
    * List<GModelElement> objectNodes = umlModel.getPackagedElements().stream()
    * .filter(Class.class::isInstance)
    * .map(Class.class::cast)
    * // .map(objectDiagramNodeFactory::create)
    * .map(objectDiagramNodeFactory::create)
    * .collect(Collectors.toList());
    * graph.getChildren().addAll(objectNodes);
    * // Add Links
    * List<GModelElement> linkEdges = umlModel.getPackagedElements().stream()
    * .filter(Association.class::isInstance)
    * .map(Association.class::cast)
    * .map(objectDiagramEdgeFactory::create)
    * .collect(Collectors.toList());
    * graph.getChildren().addAll(linkEdges);
    * // Add Enumerations
    * List<GModelElement> enumerationNodes = umlModel.getPackagedElements().stream()
    * .filter(Enumeration.class::isInstance)
    * .map(Enumeration.class::cast)
    * .map(objectDiagramNodeFactory::create)
    * .collect(Collectors.toList());
    * graph.getChildren().addAll(enumerationNodes);
    * }
    * return graph;
    * }
    */
}

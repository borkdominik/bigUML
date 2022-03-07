package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Diagram;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.*;
import org.eclipse.uml2.uml.Class;

import java.util.List;
import java.util.stream.Collectors;

public class UmlObjectDiagramModelFactory extends DiagramFactory {

    public UmlObjectDiagramModelFactory(final UmlModelState modelState) {
        super(modelState);
    }

    @Override
    public GGraph create(final Diagram umlDiagram) {
        GGraph graph = getOrCreateRoot();

        System.out.println("in model factory");

        if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
            Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();
            graph.setId(toId(umlModel));

            // Add Object Node
            List<GModelElement> objectNodes = umlModel.getPackagedElements().stream()
                    .filter(Class.class::isInstance)
                    .map(Class.class::cast)
                    //.map(objectDiagramNodeFactory::create)
                    .map(umlObject -> objectDiagramNodeFactory.create((Classifier) umlObject))
                    .collect(Collectors.toList());
            graph.getChildren().addAll(objectNodes);

            // Add Links
            List<GModelElement> linkEdges = umlModel.getPackagedElements().stream()
                    .filter(Association.class::isInstance)
                    .map(Association.class::cast)
                    .map(objectDiagramEdgeFactory::create)
                    .collect(Collectors.toList());
            graph.getChildren().addAll(linkEdges);

            // Add Enumerations
            List<GModelElement> enumerationNodes = umlModel.getPackagedElements().stream()
                    .filter(Enumeration.class::isInstance)
                    .map(Enumeration.class::cast)
                    .map(objectDiagramNodeFactory::create)
                    .collect(Collectors.toList());
            graph.getChildren().addAll(enumerationNodes);
        }
        return graph;
    }
}

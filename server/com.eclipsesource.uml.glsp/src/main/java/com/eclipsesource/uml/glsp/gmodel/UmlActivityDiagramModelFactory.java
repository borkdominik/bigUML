package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Diagram;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.Model;

import java.util.stream.Collectors;

public class UmlActivityDiagramModelFactory extends GModelFactory {

    public UmlActivityDiagramModelFactory(final UmlModelState modelState) {
        super(modelState);
    }

    @Override
    public GGraph create(final Diagram umlDiagram) {
        GGraph graph = getOrCreateRoot();

        if (umlDiagram.getSemanticElement().getResolvedElement() != null) {
            Model umlModel = (Model) umlDiagram.getSemanticElement().getResolvedElement();

            graph.setId(toId(umlModel));

            graph.getChildren().addAll(umlModel.getPackagedElements().stream()
                    .filter(Activity.class::isInstance)
                    .map(Activity.class::cast)
                    .map(this::create)
                    .collect(Collectors.toSet()));

            //TODO: uncomment when comment is ready
            /*graph.getChildren().addAll(umlModel.getOwnedComments().stream()
                    .flatMap(c -> commentFactory.create(c).stream())
                    .collect(Collectors.toList()));*/
        }
        return graph;
    }

}

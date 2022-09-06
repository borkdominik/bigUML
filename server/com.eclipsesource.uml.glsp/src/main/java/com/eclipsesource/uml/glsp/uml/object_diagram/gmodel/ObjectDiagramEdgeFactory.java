package com.eclipsesource.uml.glsp.uml.object_diagram.gmodel;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.*;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Relationship;

import java.util.ArrayList;

public class ObjectDiagramEdgeFactory extends AbstractGModelFactory<Relationship, GEdge> {

    public ObjectDiagramEdgeFactory(final UmlModelState modelState) {
        super(modelState);
    }

    @Override
    public GEdge create(final Relationship element) {
        if (element instanceof Association) {
            return createLinkEdge((Association) element);
        }
        return null;
    }

    protected GEdge createLinkEdge(final Association link) {

        EList<Property> memberEnds = link.getMemberEnds();
        Property source = memberEnds.get(0);
        Property target = memberEnds.get(1);

        GEdgeBuilder builder = new GEdgeBuilder(Types.LINK)
                .id(toId(link))
                .addCssClass(CSS.EDGE)
                .sourceId(toId(source.getType()))
                .targetId(toId(target.getType()))
                .routerKind(GConstants.RouterKind.MANHATTAN);

        modelState.getIndex().getNotation(link, Edge.class).ifPresent(edge -> {
            if (edge.getBendPoints() != null) {
                ArrayList<GPoint> bendPoints = new ArrayList<>();
                edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
                builder.addRoutingPoints(bendPoints);
            }
        });
        return builder.build();
    }
}

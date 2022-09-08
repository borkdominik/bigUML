package com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.*;

import java.util.ArrayList;
import java.util.List;

public class StateMachineDiagramEdgeFactory extends AbstractGModelFactory<Transition, GEdge> {

    public StateMachineDiagramEdgeFactory(final UmlModelState modelState) {
        super(modelState);
    }

    @Override
    public GEdge create(final Transition element) {
        System.out.println("edge factory transition");
        Vertex source = element.getSource();
        Vertex target = element.getTarget();

        String sourceId = toId(source);
        String targetId = toId(target);

        GEdgeBuilder b = new GEdgeBuilder(Types.TRANSITION)
                .id(toId(element))
                .addCssClass(CSS.EDGE)
                .sourceId(sourceId)
                .targetId(targetId)
                .routerKind(GConstants.RouterKind.MANHATTAN);

        if (element.getName() != null) {
            b.add(createTransitionLabel(element.getName(), UmlIDUtil.createLabelNameId(toId(element)), 0.1d));
        }
        if (element.getGuard() != null && !element.getGuard().getName().isEmpty()) {
            b.add(createTransitionGuardLabel(element.getGuard(), UmlIDUtil.createLabelGuardId(toId(element)), 0.5d));
        }
        if (element.getEffect() != null && !element.getEffect().getName().isEmpty()) {
            b.add(createTransitionEffectLabel(element.getEffect(), UmlIDUtil.createLabelEffectId(toId(element)), 0.8d));
        }
        if (element.getTriggers() != null && !element.getTriggers().isEmpty()) {
            b.add(createTransitionTriggerLabel(element.getTriggers(), UmlIDUtil.createLabelTriggerId(toId(element)), 0.5d));
        }

        modelState.getIndex().getNotation(element, Edge.class).ifPresent(transition -> {
            if (transition.getBendPoints() != null) {
                ArrayList<GPoint> bendPoints =new ArrayList<GPoint>();
                transition.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
                b.addRoutingPoints(bendPoints);
            }
        });

        return b.build();
    }

    protected GLabel createTransitionLabel(final String name, final String id, final double position) {
        return createEdgeLabel(name, position, id, Types.LABEL_TRANSITION_NAME, GConstants.EdgeSide.BOTTOM);
    }

    protected GLabel createTransitionGuardLabel(final Constraint contstraint, final String id, final double position) {
        String name = contstraint.getName();
        return createEdgeLabel(name, position, id, Types.LABEL_TRANSITION_GUARD, GConstants.EdgeSide.TOP);
    }

    protected GLabel createTransitionEffectLabel(final Behavior effect, final String id, final double position) {
        String name = effect.getName();
        return createEdgeLabel(name, position, id, Types.LABEL_TRANSITION_EFFECT, GConstants.EdgeSide.TOP);
    }

    protected GLabel createTransitionTriggerLabel(final List<Trigger> triggers, final String id,
                                                  final double position) {
        String name = triggers.get(0).getName();
        return createEdgeLabel(name, position, id, Types.LABEL_TRANSITION_TRIGGER, GConstants.EdgeSide.BOTTOM);
    }

    protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
                                     final String side) {
        return new GLabelBuilder(type) //
                .edgePlacement(new GEdgePlacementBuilder()//
                        .side(side)//
                        .position(position)//
                        .offset(2d) //
                        .rotate(false) //
                        .build())//
                .id(id) //
                .text(name).build();
    }
}

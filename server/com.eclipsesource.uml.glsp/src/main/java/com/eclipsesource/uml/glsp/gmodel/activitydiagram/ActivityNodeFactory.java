package com.eclipsesource.uml.glsp.gmodel.activitydiagram;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.gmodel.GModelFactory;
import com.eclipsesource.uml.glsp.gmodel.LabelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Action;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ObjectNode;

//TODO: ADD REMAINING ELEMENTS
public class ActivityNodeFactory extends AbstractGModelFactory<ActivityNode, GNode> {

    private final GModelFactory parentFactory;

    public ActivityNodeFactory(final UmlModelState modelState, final GModelFactory parentFactory) {
        super(modelState);
        this.parentFactory = parentFactory;
    }

    @Override
    public GNode create(final ActivityNode activityNode) {
        if (activityNode instanceof Action) {
            return create((Action) activityNode);
        }
        return null;
    }

    protected void applyShapeData(final ActivityNode activityNode, final GNodeBuilder builder) {
        modelState.getIndex().getNotation(activityNode, Shape.class).ifPresent(shape -> {
            if (shape.getPosition() != null) {
                builder.position(GraphUtil.copy(shape.getPosition()));
            }
            if (shape.getSize() != null) {
                builder.size(GraphUtil.copy(shape.getSize()));
            }
        });
    }

    protected GCompartment buildActivityHeader(final Action action) {
        String text = action.getName();
        String labelType = UmlConfig.Types.LABEL_NAME;
        /*if (action instanceof CallBehaviorAction) {
            CallBehaviorAction cba = (CallBehaviorAction) action;
            text = cba.getBehavior() != null ? cba.getBehavior().getName() : "<NoRef>";
            labelType = Types.CALL_REF;
        }*/
        return new GCompartmentBuilder(UmlConfig.Types.COMP_HEADER) //
                .layout("hbox") //
                .id(UmlIDUtil.createHeaderId(toId(action)))
                .add(new GLabelBuilder(labelType) //
                        .id(UmlIDUtil.createHeaderLabelId(toId(action))).text(text) //
                        .build()) //
                .build();
    }

    protected GCompartment buildHeader(final ObjectNode node) {
        return new GCompartmentBuilder(UmlConfig.Types.COMP_HEADER) //
                .layout("hbox") //
                .id(UmlIDUtil.createHeaderId(toId(node)))
                .add(new GLabelBuilder(UmlConfig.Types.LABEL_NAME) //
                        .id(UmlIDUtil.createHeaderLabelId(toId(node))).text(node.getName()) //
                        .build()) //
                .build();
    }

}

package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.ActivityUtil;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.OpaqueExpression;

import java.util.Collection;
import java.util.stream.Collectors;

public class ActivityDiagramNodeFactory extends AbstractGModelFactory<Classifier, GNode> {

    private final DiagramFactory parentFactory;

    public ActivityDiagramNodeFactory(final UmlModelState modelState, final DiagramFactory parentFactory) {
        super(modelState);
        this.parentFactory = parentFactory;
    }

    @Override
    public GNode create(final Classifier classifier) {
        if (classifier instanceof Activity) {
            return create((Activity) classifier);
        }
        return null;
    }

    // ACTIVITY
    protected GNode create(final Activity umlActivity) {
        Collection<EObject> children = umlActivity.getOwnedNodes().stream()
                .filter(node -> node.getInPartitions().isEmpty() && node.getInGroups().isEmpty())
                .collect(Collectors.toList());
        children.addAll(umlActivity.getOwnedGroups());
        children.addAll(umlActivity.getEdges());
        children.addAll(ActivityUtil.getAllExceptionHandlers(umlActivity));

        GNodeBuilder b = new GNodeBuilder(Types.ACTIVITY) //
                .id(toId(umlActivity)) //
                .layout(GConstants.Layout.VBOX) //
                .addCssClass(CSS.NODE) //
                .add(buildActivityHeader(umlActivity))//
                .add(createConditionCompartment(umlActivity))
                .add(createActivityChildrenCompartment(children, umlActivity));

        applyShapeData(umlActivity, b);
        return b.build();
    }

    protected void applyShapeData(final Classifier classifier, final GNodeBuilder builder) {
        modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
            if (shape.getPosition() != null) {
                builder.position(GraphUtil.copy(shape.getPosition()));
            }
            if (shape.getSize() != null) {
                builder.size(GraphUtil.copy(shape.getSize()));
            }
        });
    }

    protected GCompartment buildActivityHeader(final Activity umlActivity) {
        GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(Types.COMP_HEADER)
                .layout(GConstants.Layout.HBOX)
                .id(UmlIDUtil.createHeaderId(toId(umlActivity)));

        GCompartment classHeaderIcon = new GCompartmentBuilder(getType(umlActivity))
                .id(UmlIDUtil.createHeaderIconId(toId(umlActivity))).build();
        classHeaderBuilder.add(classHeaderIcon);

        GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
                .id(UmlIDUtil.createHeaderLabelId(toId(umlActivity)))
                .text(umlActivity.getName()).build();
        classHeaderBuilder.add(classHeaderLabel);

        return classHeaderBuilder.build();
    }

    protected GCompartment createActivityChildrenCompartment(final Collection<? extends EObject> children,
                                                             final Activity activity) {
        return new GCompartmentBuilder(Types.COMP) //
                .id(toId(activity) + "_childCompartment")
                .layout(GConstants.Layout.VBOX) //
                .layoutOptions(new GLayoutOptions() //
                        .hAlign(GConstants.HAlign.LEFT) //
                        .resizeContainer(true)) //
                .addAll(children.stream() //
                        .map(parentFactory::create)
                        .collect(Collectors.toList()))
                .addAll(activity.getOwnedComments().stream()
                        .flatMap(c -> parentFactory.commentFactory.create(c).stream())
                        .collect(Collectors.toList()))
                .build();
    }

    protected GCompartment createConditionCompartment(final Activity activity) {
        return new GCompartmentBuilder(Types.COMP) //
                .id(toId(activity) + "_conditionCompartment")
                .layout(GConstants.Layout.VBOX)
                .addCssClass(CSS.ACTIVITY_CONDITION)
                .layoutOptions(new GLayoutOptions() //
                        .hAlign(GConstants.HAlign.LEFT) //
                        .resizeContainer(true)) //
                .addAll(activity.getOwnedRules().stream() //
                        .map(this::createConditionNode)
                        .collect(Collectors.toList()))
                .build();
    }

    private GLabel createConditionNode(final Constraint constraint) {
        GLabel label = new GLabelBuilder(Types.LABEL_NAME)
                .id(UmlIDUtil.createHeaderLabelId(toId(constraint)))
                .text(((OpaqueExpression) constraint.getSpecification()).getBodies().get(0)).build();

        return label;
    }

    protected static String getType(final Classifier classifier) {
        if (classifier instanceof Activity) {
            return Types.ICON_ACTIVITY;
        }
        return "Classifier not found";
    }

}
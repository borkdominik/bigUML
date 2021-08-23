package com.eclipsesource.uml.glsp.gmodel.activitydiagram;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.gmodel.LabelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Action;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityNode;

public class ActivityNodeFactory /*extends AbstractGModelFactory<Activity, GNode>*/ {

    private final LabelFactory labelFactory;

    public ActivityNodeFactory(final UmlModelState modelState, final LabelFactory labelFactory) {
        //super(modelState);
        this.labelFactory = labelFactory;
    }

    /*@Override
    public GNode create(final ActivityNode activityNode) {
        if (activityNode instanceof Action) {
            return create((Action) activityNode);
        }
        return null;
    }*/

}

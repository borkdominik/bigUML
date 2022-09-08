package com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions;

import com.eclipsesource.uml.glsp.actions.ActionKind;
import org.eclipse.glsp.server.actions.ResponseAction;

public class AddTransitionLabelAction extends ResponseAction {

    private String elementTypeId;

    public AddTransitionLabelAction() {
        super(ActionKind.ADD_TRANSITION_LABEL);
    }

    public AddTransitionLabelAction(final String elementTypeId) {
        super(ActionKind.ADD_TRANSITION_LABEL);
        this.elementTypeId = elementTypeId;
    }

    public String getElementTypeId() { return elementTypeId; }

    public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}

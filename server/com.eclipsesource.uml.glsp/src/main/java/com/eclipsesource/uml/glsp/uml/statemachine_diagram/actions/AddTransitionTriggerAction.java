package com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions;

import com.eclipsesource.uml.glsp.actions.ActionKind;
import org.eclipse.glsp.server.actions.ResponseAction;

public class AddTransitionTriggerAction extends ResponseAction {

    private String elementTypeId;

    public AddTransitionTriggerAction() {
        super(ActionKind.ADD_TRANSITION_TRIGGER);
    }

    public AddTransitionTriggerAction(final String elementTypeId) {
        super(ActionKind.ADD_TRANSITION_TRIGGER);
        this.elementTypeId = elementTypeId;
    }

    public String getElementTypeId() { return elementTypeId; }

    public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }
}

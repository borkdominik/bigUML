package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.glsp.core.handler.action.ActionKind;

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

package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.glsp.core.actions.ActionKind;

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

package com.eclipsesource.uml.glsp.actions.statemachine;

import com.eclipsesource.uml.glsp.actions.ActionKind;
import org.eclipse.glsp.server.actions.ResponseAction;

public class AddTransitionGuardAction extends ResponseAction {

    private String elementTypeId;

    public AddTransitionGuardAction() {
        super(ActionKind.ADD_TRANSITION_GUARD);
    }

    public AddTransitionGuardAction(final String elementTypeId) {
        super(ActionKind.ADD_TRANSITION_GUARD);
        this.elementTypeId = elementTypeId;
    }

    public String getElementTypeId() { return elementTypeId; }

    public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}
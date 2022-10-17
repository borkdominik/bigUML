package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

import org.eclipse.glsp.server.actions.ResponseAction;

import com.eclipsesource.uml.glsp.core.handler.action.ActionKind;

public class AddTransitionEffectAction extends ResponseAction {

    private String elementTypeId;

    public AddTransitionEffectAction() {
        super(ActionKind.ADD_TRANSITION_EFFECT);
    }

    public AddTransitionEffectAction(final String elementTypeId) {
        super(ActionKind.ADD_TRANSITION_EFFECT);
        this.elementTypeId = elementTypeId;
    }

    public String getElementTypeId() { return elementTypeId; }

    public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}

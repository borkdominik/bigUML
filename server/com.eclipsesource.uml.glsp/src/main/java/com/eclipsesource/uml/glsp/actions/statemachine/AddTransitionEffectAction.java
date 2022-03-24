package com.eclipsesource.uml.glsp.actions.statemachine;

import com.eclipsesource.uml.glsp.actions.ActionKind;
import org.eclipse.glsp.server.actions.ResponseAction;

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

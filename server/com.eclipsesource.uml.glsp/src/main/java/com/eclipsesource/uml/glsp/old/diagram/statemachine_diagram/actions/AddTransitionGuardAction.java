package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

import org.eclipse.glsp.server.actions.ResponseAction;

public class AddTransitionGuardAction extends ResponseAction {
   public static final String TYPE = "addTransitionGuard";

   private String elementTypeId;

   public AddTransitionGuardAction() {
      super(TYPE);
   }

   public AddTransitionGuardAction(final String elementTypeId) {
      super(TYPE);
      this.elementTypeId = elementTypeId;
   }

   public String getElementTypeId() { return elementTypeId; }

   public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}

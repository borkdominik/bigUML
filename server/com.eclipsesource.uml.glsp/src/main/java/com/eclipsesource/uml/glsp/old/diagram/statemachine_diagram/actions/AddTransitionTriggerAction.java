package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

import org.eclipse.glsp.server.actions.ResponseAction;

public class AddTransitionTriggerAction extends ResponseAction {
   public static final String TYPE = "addTransitionTrigger";

   private String elementTypeId;

   public AddTransitionTriggerAction() {
      super(TYPE);
   }

   public AddTransitionTriggerAction(final String elementTypeId) {
      super(TYPE);
      this.elementTypeId = elementTypeId;
   }

   public String getElementTypeId() { return elementTypeId; }

   public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }
}

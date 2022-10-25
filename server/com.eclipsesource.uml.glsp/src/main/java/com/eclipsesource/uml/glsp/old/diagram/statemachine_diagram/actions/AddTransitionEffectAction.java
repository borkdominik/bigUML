package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

import org.eclipse.glsp.server.actions.ResponseAction;

public class AddTransitionEffectAction extends ResponseAction {
   public static final String TYPE = "addTransitionEffect";

   private String elementTypeId;

   public AddTransitionEffectAction() {
      super(TYPE);
   }

   public AddTransitionEffectAction(final String elementTypeId) {
      super(TYPE);
      this.elementTypeId = elementTypeId;
   }

   public String getElementTypeId() { return elementTypeId; }

   public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}

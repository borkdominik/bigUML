package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.actions;

import org.eclipse.glsp.server.actions.ResponseAction;

public class AddTransitionLabelAction extends ResponseAction {
   public static final String TYPE = "addTransitionLabel";

   private String elementTypeId;

   public AddTransitionLabelAction() {
      super(TYPE);
   }

   public AddTransitionLabelAction(final String elementTypeId) {
      super(TYPE);
      this.elementTypeId = elementTypeId;
   }

   public String getElementTypeId() { return elementTypeId; }

   public void setElementTypeId(final String elementTypeId) { this.elementTypeId = elementTypeId; }

}

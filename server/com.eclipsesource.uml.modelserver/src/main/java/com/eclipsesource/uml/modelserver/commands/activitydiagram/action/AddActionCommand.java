/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.activitydiagram.action;

public class AddActionCommand { /*-

   protected final Action action;
   protected final Element parent;
   protected final String parentSemanticUri;

   public AddActionCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
                           final String className) {
      super(domain, modelUri);
      this.parentSemanticUri = parentUri;
      try {
         if (AddActionCommandContribution.SIGNAL_EVENT.equals(className)
               || AddActionCommandContribution.TIME_EVENT.equals(className)) {
            AcceptEventAction a = UMLFactory.eINSTANCE.createAcceptEventAction();
            a.createTrigger(className);
            this.action = a;
         } else {
            Class<? extends Action> clazz;
            clazz = Class.forName(className).asSubclass(Action.class);
            if (OpaqueAction.class.equals(clazz)) {
               this.action = UMLFactory.eINSTANCE.createOpaqueAction();
            } else if (SendSignalAction.class.equals(clazz)) {
               this.action = UMLFactory.eINSTANCE.createSendSignalAction();
            } else if (CallBehaviorAction.class.equals(clazz)) {
               this.action = UMLFactory.eINSTANCE.createCallBehaviorAction();
            } else {
               throw new RuntimeException("Invalid Action class: " + className);
            }
         }
         parent = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Element.class);
      } catch (ClassNotFoundException e) {
         throw new RuntimeException(e);
      }
   }

   @Override
   protected void doExecute() {
      Random rand = new Random();
      NamedElement parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUri, NamedElement.class);
      action.setName("NewAction_" + rand.nextInt(1000));
      if (parentContainer instanceof ActivityPartition) {
         ((ActivityPartition) parentContainer).getNodes().add(action);
      } else if (parentContainer instanceof Activity) {
         ((Activity) parentContainer).getNodes().add(action);
      } else if (parentContainer instanceof InterruptibleActivityRegion) {
         ((InterruptibleActivityRegion) parentContainer).getNodes().add(action);
      }

      /*Activity activity = null;
      if (parent instanceof ActivityPartition) {
         ActivityPartition partition = ((ActivityPartition) parent);
         activity = partition.containingActivity();
         partition.getNodes().add(action);
      } else if (parent instanceof InterruptibleActivityRegion) {
         InterruptibleActivityRegion region = ((InterruptibleActivityRegion) parent);
         activity = region.containingActivity();
         region.getNodes().add(action);
      } else if (parent instanceof Activity) {
         activity = (Activity) parent;
         //activity.getOwnedNodes().add(action);
      } else {
         throw new RuntimeException("Invalid action conatainer type: " + parent.getClass().getSimpleName());
      }

      //System.out.println();

      if (action instanceof OpaqueAction) {
         long id = activity.getOwnedNodes().stream().filter(Action.class::isInstance).count();
         action.setName("NewAction" + id);
      } else if (action instanceof AcceptEventAction) {
         long id = activity.getOwnedNodes().stream().filter(AcceptEventAction.class::isInstance).count();
         action.setName("NewEvent" + id);
      } else if (action instanceof SendSignalAction) {
         long id = activity.getOwnedNodes().stream().filter(SendSignalAction.class::isInstance).count();
         action.setName("NewSignal" + id);
      }
      // FIXME: THIS LEADS TO DUPLICATES AND DOES NOT WORK WITHOUT IT ATM!!!!
      activity.getOwnedNodes().add(action);*
   }

   public Action getNewAction() { return action; }
   */
}

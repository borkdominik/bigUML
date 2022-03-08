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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.AcceptEventAction;
import org.eclipse.uml2.uml.Action;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.CallBehaviorAction;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.InterruptibleActivityRegion;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.SendSignalAction;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddActionCommand extends UmlSemanticElementCommand {

   protected final Action action;
   protected final Element parent;

   public AddActionCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
      final String className) {
      super(domain, modelUri);
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
               CallBehaviorAction cba = UMLFactory.eINSTANCE.createCallBehaviorAction();
               action = cba;
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

      Activity activity = null;
      if (parent instanceof Activity) {
         activity = (Activity) parent;
      } else if (parent instanceof ActivityPartition) {
         ActivityPartition partition = ((ActivityPartition) parent);
         activity = partition.containingActivity();
         partition.getNodes().add(action);
      } else if (parent instanceof InterruptibleActivityRegion) {
         InterruptibleActivityRegion region = ((InterruptibleActivityRegion) parent);
         activity = region.containingActivity();
         region.getNodes().add(action);
      } else {
         throw new RuntimeException("Invalid action conatainer type: " + parent.getClass().getSimpleName());
      }

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

      activity.getOwnedNodes().add(action);
   }

   public Action getNewAction() { return action; }

}

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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.flow;

import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.CallAction;
import org.eclipse.uml2.uml.DecisionNode;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ForkNode;
import org.eclipse.uml2.uml.InputPin;
import org.eclipse.uml2.uml.JoinNode;
import org.eclipse.uml2.uml.MergeNode;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.OutputPin;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

/**
 * Converts a parameter type into the opposite type: Converts a InputPin to an OutputPin and vise versa;
 * And changes the Parameter direction of an ActivityParameterNode.
 * In case of a Pin, it supplies the new created Pin.
 *
 * @author Andreas
 *
 */
public class ConvertConnectedFlowElementTypeCommand extends UmlSemanticElementCommand
   implements Supplier<ActivityNode> {

   private final String oldElemUri;
   private ActivityNode newElem;

   public ConvertConnectedFlowElementTypeCommand(final EditingDomain domain, final URI modelUri,
      final String oldElemUri) {
      super(domain, modelUri);
      this.oldElemUri = oldElemUri;
   }

   @Override
   protected void doExecute() {

      ActivityNode oldElem = UmlSemanticCommandUtil.getElement(umlModel, oldElemUri, ActivityNode.class);

      if (oldElem instanceof InputPin) {
         // InputPin to OutputPin
         InputPin inputPin = (InputPin) oldElem;
         OutputPin outputPin = UMLFactory.eINSTANCE.createOutputPin();
         outputPin.setName(inputPin.getName());
         inputPin.getOutgoings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setSource(outputPin);
         });

         Element owner = inputPin.getOwner();
         if (owner instanceof OpaqueAction) {
            OpaqueAction action = (OpaqueAction) owner;
            action.getInputValues().clear();
            action.getOutputValues().add(outputPin);
         } else if (owner instanceof CallAction) {
            CallAction action = (CallAction) owner;
            // action.getArguments().clear();
            // TODO: ???
         }

         newElem = outputPin;
      } else if (oldElem instanceof OutputPin) {
         // OutputPin to InputPin
         OutputPin outputPin = (OutputPin) oldElem;
         InputPin inputPin = UMLFactory.eINSTANCE.createInputPin();
         inputPin.setName(outputPin.getName());
         outputPin.getIncomings().stream().collect(Collectors.toList()).forEach(oe -> {
            oe.setTarget(inputPin);
         });

         Element owner = outputPin.getOwner();
         if (owner instanceof OpaqueAction) {
            OpaqueAction action = (OpaqueAction) owner;
            action.getOutputValues().clear();
            action.getInputValues().add(inputPin);
         }

         newElem = inputPin;
      } else if (oldElem instanceof DecisionNode) {
         DecisionNode decisionNode = (DecisionNode) oldElem;
         Activity owner = decisionNode.getActivity();
         MergeNode mergeNode = UMLFactory.eINSTANCE.createMergeNode();

         oldElem.getIncomings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setTarget(mergeNode);
         });
         oldElem.getOutgoings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setSource(mergeNode);
         });

         owner.getOwnedNodes().add(mergeNode);
         decisionNode.getInGroups().forEach(g -> {
            g.getContainedNodes().add(mergeNode);
         });
         owner.getOwnedNodes().remove(decisionNode);

         newElem = mergeNode;
      } else if (oldElem instanceof MergeNode) {
         MergeNode mergeNode = (MergeNode) oldElem;
         Activity owner = mergeNode.getActivity();
         DecisionNode decisionNode = UMLFactory.eINSTANCE.createDecisionNode();

         oldElem.getIncomings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setTarget(decisionNode);
         });
         oldElem.getOutgoings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setSource(decisionNode);
         });

         owner.getOwnedNodes().add(decisionNode);
         mergeNode.getInGroups().forEach(g -> {
            g.getContainedNodes().add(decisionNode);
         });
         owner.getOwnedNodes().remove(mergeNode);

         newElem = decisionNode;
      } else if (oldElem instanceof ForkNode) {
         ForkNode forkNode = (ForkNode) oldElem;
         Activity owner = forkNode.getActivity();
         JoinNode joinNode = UMLFactory.eINSTANCE.createJoinNode();

         oldElem.getIncomings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setTarget(joinNode);
         });
         oldElem.getOutgoings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setSource(joinNode);
         });

         owner.getOwnedNodes().add(joinNode);
         forkNode.getInGroups().forEach(g -> {
            g.getContainedNodes().add(joinNode);
         });
         owner.getOwnedNodes().remove(forkNode);

         newElem = joinNode;
      } else if (oldElem instanceof JoinNode) {
         JoinNode joinNode = (JoinNode) oldElem;
         Activity owner = joinNode.getActivity();
         ForkNode forkNode = UMLFactory.eINSTANCE.createForkNode();

         oldElem.getIncomings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setTarget(forkNode);
         });
         oldElem.getOutgoings().stream().collect(Collectors.toList()).forEach(ie -> {
            ie.setSource(forkNode);
         });

         owner.getOwnedNodes().add(forkNode);
         joinNode.getInGroups().forEach(g -> {
            g.getContainedNodes().add(forkNode);
         });
         owner.getOwnedNodes().remove(joinNode);

         newElem = forkNode;
      }

   }

   @Override
   public ActivityNode get() {
      return newElem;
   }

}

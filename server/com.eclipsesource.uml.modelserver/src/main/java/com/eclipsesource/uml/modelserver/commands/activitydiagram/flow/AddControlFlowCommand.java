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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Action;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityEdge;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityParameterNode;
import org.eclipse.uml2.uml.CentralBufferNode;
import org.eclipse.uml2.uml.DecisionNode;
import org.eclipse.uml2.uml.ForkNode;
import org.eclipse.uml2.uml.InputPin;
import org.eclipse.uml2.uml.JoinNode;
import org.eclipse.uml2.uml.LiteralString;
import org.eclipse.uml2.uml.MergeNode;
import org.eclipse.uml2.uml.ObjectFlow;
import org.eclipse.uml2.uml.ObjectNode;
import org.eclipse.uml2.uml.OutputPin;
import org.eclipse.uml2.uml.Pin;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddControlFlowCommand extends UmlSemanticElementCommand implements Supplier<ActivityEdge> {

   private ActivityEdge edge;
   protected ActivityNode source;
   protected ActivityNode target;
   protected Activity activity;

   private final EditingDomain domain;
   private final URI modelUri;

   public AddControlFlowCommand(final EditingDomain domain, final URI modelUri,
      final String sourceClassUriFragment, final String targetClassUriFragment) {
      super(domain, modelUri);
      this.domain = domain;
      this.modelUri = modelUri;

      source = UmlSemanticCommandUtil.getElement(umlModel, sourceClassUriFragment, ActivityNode.class);
      target = UmlSemanticCommandUtil.getElement(umlModel, targetClassUriFragment, ActivityNode.class);
      activity = target.getActivity();

      if (source instanceof ObjectNode || target instanceof ObjectNode) {
         edge = UMLFactory.eINSTANCE.createObjectFlow();
         if (target instanceof Pin) {
            activity = ((Action) target.getOwner()).containingActivity();
         }
      } else {
         edge = UMLFactory.eINSTANCE.createControlFlow();
      }
   }

   public boolean needsToConvertSource() {
      return validate() && (source instanceof InputPin && ((InputPin) source).getOutgoings().isEmpty()
         || source instanceof MergeNode && source.getIncomings().size() < 2 && source.getOutgoings().size() == 1
         || source instanceof JoinNode && source.getIncomings().size() < 2 && source.getOutgoings().size() == 1);
   }

   public boolean needsToConvertTarget() {
      return validate() && (target instanceof OutputPin && ((OutputPin) target).getIncomings().isEmpty()
         || target instanceof DecisionNode && target.getIncomings().size() == 1 && target.getOutgoings().size() < 2
         || target instanceof ForkNode && target.getIncomings().size() == 1 && target.getOutgoings().size() < 2);
   }

   @Override
   protected void doExecute() {
      if (!validate()) {
         edge = null;
         return;
      }

      edge.setSource(source);
      edge.setTarget(target);

      LiteralString guard = (LiteralString) edge.createGuard("guard", null,
         UMLFactory.eINSTANCE.createLiteralString().eClass());
      LiteralString weight = (LiteralString) edge.createWeight("weigth", null,
         UMLFactory.eINSTANCE.createLiteralString().eClass());
      guard.setValue("");
      weight.setValue("");
      activity.getEdges().add(edge);

      if (source instanceof ActivityParameterNode) {
         adjustParameterTypes((ActivityParameterNode) source);
      }
      if (target instanceof ActivityParameterNode) {
         adjustParameterTypes((ActivityParameterNode) target);
      }
   }

   @Override
   public ActivityEdge get() {
      return edge;
   }

   /**
    * Set the correct ParameterDirection of the parameter.
    *
    * @param param
    */
   private void adjustParameterTypes(final ActivityParameterNode param) {
      /*
       * if (!param.getIncomings().isEmpty() && !param.getOutgoings().isEmpty()) {
       * param.getParameter().setDirection(ParameterDirectionKind.INOUT_LITERAL);
       * } else if (!param.getIncomings().isEmpty()) {
       * param.getParameter().setDirection(ParameterDirectionKind.IN_LITERAL);
       * } else if (!param.getOutgoings().isEmpty()) {
       * param.getParameter().setDirection(ParameterDirectionKind.OUT_LITERAL);
       * }
       */
   }

   private boolean validate() {

      // if objectflow -> source is ObjectNode && target is ObjectNode
      if (edge instanceof ObjectFlow && !(source instanceof ObjectNode) && !(target instanceof ObjectNode)) {
         return false;
      }

      // source is CentralBuffer XOR target is CentralBuffer
      if (source instanceof CentralBufferNode && target instanceof CentralBufferNode) {
         return false;
      }

      // if there are already edges from the source, it cant be an inputpin
      if (source instanceof InputPin && !((InputPin) source).getOutgoings().isEmpty()) {
         return false;
      }

      // -''-
      if (target instanceof OutputPin && !((OutputPin) target).getIncomings().isEmpty()) {
         return false;
      }

      return true;
   }

}

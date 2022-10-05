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

public class RemoveActivityEdgeCommand { /*-

   protected final String parentSemanticUriFragment;
   protected final String semanticUriFragment;
   protected final ActivityEdge edge;
   protected ActivityNode source;
   protected ActivityNode target;

   public RemoveActivityEdgeCommand(final EditingDomain domain, final URI modelUri,
      final String parentSemanticUriFragment,
      final String semanticUriFragment) {
      super(domain, modelUri);
      this.parentSemanticUriFragment = parentSemanticUriFragment;
      this.semanticUriFragment = semanticUriFragment;

      edge = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, ActivityEdge.class);
      source = edge.getSource();
      target = edge.getTarget();
   }

   public boolean needsToConvertSource() {
      return source instanceof DecisionNode && source.getIncomings().size() > 1 && source.getOutgoings().size() == 2
         || source instanceof ForkNode && source.getIncomings().size() > 1 && source.getOutgoings().size() == 2;
   }

   public boolean needsToConvertTarget() {
      return target instanceof MergeNode && target.getIncomings().size() == 2 && target.getOutgoings().size() > 1
         || target instanceof JoinNode && target.getIncomings().size() == 2 && target.getOutgoings().size() > 1;
   }

   public String getSourceUri() { return EcoreUtil.getURI(source).fragment(); }

   public String getTargetUri() { return EcoreUtil.getURI(target).fragment(); }

   @Override
   protected void doExecute() {
      Activity activity = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Activity.class);

      if (activity != null && edge != null) {
         if (edge.getSource() != null) {
            edge.getSource().getOutgoings().remove(edge);
         }
         if (edge.getTarget() != null) {
            edge.getTarget().getIncomings().remove(edge);
         }
         activity.getEdges().remove(edge);

      }
   }
   */
}

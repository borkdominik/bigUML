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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.general;

public class RemoveActivityNodeCommand { /*-

   private final Activity activity;
   private final ActivityNode node;

   public RemoveActivityNodeCommand(final EditingDomain domain, final URI modelUri,
      final String parentSemanticUriFragment,
      final String semanticUriFragment) {
      super(domain, modelUri);
      activity = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Activity.class);
      node = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, ActivityNode.class);
   }

   public List<ActivityEdge> getConnectedEdges() {
      return activity.getEdges().stream()
         .filter(e -> e.getSource().equals(node) || e.getTarget().equals(node))
         .collect(Collectors.toList());
   }

   @Override
   protected void doExecute() {

      // remove possible comment links
      activity.getOwnedComments().stream()
         .filter(c -> c.getAnnotatedElements().contains(node))
         .collect(Collectors.toList())
         .forEach(c -> c.getAnnotatedElements().remove(node));

      activity.getOwnedNodes().remove(node);
   }
   */
}

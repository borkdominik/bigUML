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

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityEdge;
import org.eclipse.uml2.uml.ActivityNode;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveActivityNodeCommand extends UmlSemanticElementCommand {

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

}

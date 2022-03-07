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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.partition;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityGroup;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.InterruptibleActivityRegion;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemovePartitionCommand extends UmlSemanticElementCommand {

   private final ActivityGroup group;

   public RemovePartitionCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      super(domain, modelUri);
      group = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, ActivityGroup.class);
   }

   public ActivityGroup getGroup() { return group; }

   public List<ActivityNode> getGroupNodes() {
      return group instanceof ActivityPartition ? ((ActivityPartition) group).getNodes()
         : group instanceof InterruptibleActivityRegion ? ((InterruptibleActivityRegion) group).getNodes() : List.of();
   }

   @Override
   protected void doExecute() {
      Element parent = group.getOwner();

      // remove possible comment links
      parent.getOwnedComments().stream()
         .filter(c -> c.getAnnotatedElements().contains(group))
         .collect(Collectors.toList())
         .forEach(c -> c.getAnnotatedElements().remove(group));

      if (parent instanceof Activity) {
         ((Activity) parent).getOwnedGroups().remove(group);
      } else if (parent instanceof ActivityPartition) {
         ((ActivityPartition) parent).getSubpartitions().remove(group);
      }
   }

}

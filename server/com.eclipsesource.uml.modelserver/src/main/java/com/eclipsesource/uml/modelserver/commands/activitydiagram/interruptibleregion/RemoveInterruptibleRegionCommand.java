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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.interruptibleregion;

import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.InterruptibleActivityRegion;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveInterruptibleRegionCommand extends UmlSemanticElementCommand {

   private final InterruptibleActivityRegion region;

   public RemoveInterruptibleRegionCommand(final EditingDomain domain, final URI modelUri,
      final String semanticUriFragment) {
      super(domain, modelUri);
      region = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, InterruptibleActivityRegion.class);
   }

   public InterruptibleActivityRegion getRegion() { return region; }

   @Override
   protected void doExecute() {
      Element parent = region.getOwner();

      // remove possible comment links
      parent.getOwnedComments().stream()
         .filter(c -> c.getAnnotatedElements().contains(region))
         .collect(Collectors.toList())
         .forEach(c -> c.getAnnotatedElements().remove(region));

      if (parent instanceof Activity) {
         ((Activity) parent).getOwnedGroups().remove(region);
      } else if (parent instanceof ActivityPartition) {
         ((ActivityPartition) parent).getSubgroups().remove(region);
      } else if (parent instanceof InterruptibleActivityRegion) {
         ((InterruptibleActivityRegion) parent).getSubgroups().remove(region);
      }
   }

}

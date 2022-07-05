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

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

import java.util.function.Supplier;

public class AddInterruptibleRegionCommand extends UmlSemanticElementCommand
      implements Supplier<InterruptibleActivityRegion> {

   private InterruptibleActivityRegion region;
   private final Element container;

   public AddInterruptibleRegionCommand(final EditingDomain domain, final URI modelUri, final String parentUri) {
      super(domain, modelUri);
      container = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Element.class);
   }

   @Override
   protected void doExecute() {
      region = UMLFactory.eINSTANCE.createInterruptibleActivityRegion();
      if (container instanceof Activity) {
         Activity activity = (Activity) container;
         activity.getOwnedGroups().add(region);
      } else if (container instanceof ActivityPartition) {
         ActivityPartition parent = (ActivityPartition) container;
         parent.getSubgroups().add(region);
      } else if (container instanceof InterruptibleActivityRegion) {
         InterruptibleActivityRegion parent = (InterruptibleActivityRegion) container;
         parent.getSubgroups().add(region);
      } else {
         throw new RuntimeException("Invalid partition container type: " + container.getClass().getSimpleName());
      }
   }

   @Override
   public InterruptibleActivityRegion get() {
      return region;
   }

}

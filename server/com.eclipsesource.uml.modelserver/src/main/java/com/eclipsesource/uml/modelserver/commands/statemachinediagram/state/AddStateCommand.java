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
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.state;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.UMLFactory;

public class AddStateCommand extends UmlSemanticElementCommand {

   protected final State newState;

   protected final Region containerRegion;

   public AddStateCommand(final EditingDomain domain, final URI modelUri, final String containerRegionUriFragment) {
      super(domain, modelUri);
      this.newState = UMLFactory.eINSTANCE.createState();
      this.containerRegion = UmlSemanticCommandUtil.getElement(umlModel, containerRegionUriFragment, Region.class);
   }

   @Override
   protected void doExecute() {
      newState.setName(UmlSemanticCommandUtil.getNewStateName(containerRegion));
      containerRegion.getSubvertices().add(newState);
   }

   public State getNewState() {
      return newState;
   }

}

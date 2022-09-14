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
package com.eclipsesource.uml.modelserver.commands.communication.lifeline;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;

public class CopyLifelineCommand extends UmlSemanticElementCommand {

   protected final Lifeline newLifeline;
   protected final LifelineCopyableProperties properties;
   protected final Interaction parentInteraction;

   public CopyLifelineCommand(final EditingDomain domain, final URI modelUri,
      final LifelineCopyableProperties properties,
      final Interaction parentInteraction) {
      super(domain, modelUri);
      this.newLifeline = UMLFactory.eINSTANCE.createLifeline();
      this.parentInteraction = parentInteraction;
      this.properties = properties;
   }

   @Override
   protected void doExecute() {
      newLifeline.setName(properties.getSemantic().name);
      parentInteraction.getLifelines().add(newLifeline);
   }

   public Lifeline getNewLifeline() { return newLifeline; }

}

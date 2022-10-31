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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;

public class AddLifelineSemanticCommand extends UmlSemanticElementCommand {

   protected final Lifeline newLifeline;
   protected final Interaction parentInteraction;
   protected final NameGenerator nameGenerator;

   public AddLifelineSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Interaction parentInteraction) {
      super(domain, modelUri);
      this.newLifeline = UMLFactory.eINSTANCE.createLifeline();
      this.parentInteraction = parentInteraction;
      this.nameGenerator = new ListNameGenerator(Lifeline.class, parentInteraction.getLifelines());
   }

   @Override
   protected void doExecute() {
      newLifeline.setName(nameGenerator.newName());
      parentInteraction.getLifelines().add(newLifeline);
   }

   public Lifeline getNewLifeline() { return newLifeline; }
}

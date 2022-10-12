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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.diagram.base.semantic.UmlSemanticCommand;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

public class SetLifelineNameSemanticCommand extends UmlSemanticCommand {

   protected String semanticUriFragment;
   protected String newName;

   public SetLifelineNameSemanticCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
      final String newName) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      Lifeline lifelineToRename = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Lifeline.class);
      lifelineToRename.setName(newName);
   }

}

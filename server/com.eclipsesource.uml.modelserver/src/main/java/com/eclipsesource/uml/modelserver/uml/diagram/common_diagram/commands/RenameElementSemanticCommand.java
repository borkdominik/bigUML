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
package com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.commands;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.uml.semantic.UmlSemanticElementCommand;

public class RenameElementSemanticCommand extends UmlSemanticElementCommand {

   protected NamedElement element;
   protected String newName;

   public RenameElementSemanticCommand(final EditingDomain domain, final URI modelUri,
      final NamedElement element,
      final String newName) {
      super(domain, modelUri);
      this.element = element;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      element.setName(newName);
   }

}

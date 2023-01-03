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

import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseSemanticElementCommand;

public final class RenameElementSemanticCommand extends BaseSemanticElementCommand {

   protected final NamedElement element;
   protected final String newName;

   public RenameElementSemanticCommand(final ModelContext context,
      final NamedElement element,
      final String newName) {
      super(context);
      this.element = element;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      element.setName(newName);
   }

}

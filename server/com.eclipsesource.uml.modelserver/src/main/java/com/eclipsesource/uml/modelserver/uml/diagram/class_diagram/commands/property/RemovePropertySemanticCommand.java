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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemovePropertySemanticCommand extends UmlSemanticElementCommand {

   protected final Class parent;
   protected final Property property;

   public RemovePropertySemanticCommand(final EditingDomain domain, final URI modelUri,
      final Class parent,
      final Property property) {
      super(domain, modelUri);
      this.parent = parent;
      this.property = property;
   }

   @Override
   protected void doExecute() {
      parent.getOwnedAttributes().remove(property);
   }

}

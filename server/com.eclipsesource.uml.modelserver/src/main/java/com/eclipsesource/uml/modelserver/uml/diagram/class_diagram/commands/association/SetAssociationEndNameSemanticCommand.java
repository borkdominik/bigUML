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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class SetAssociationEndNameSemanticCommand extends UmlSemanticElementCommand {

   protected final Property property;
   protected final String newName;

   public SetAssociationEndNameSemanticCommand(final EditingDomain domain, final URI modelUri, final Property property,
      final String newName) {
      super(domain, modelUri);
      this.property = property;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      property.setName(newName);
   }
}

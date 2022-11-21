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

public class SetAssociationEndMultiplicitySemanticCommand extends UmlSemanticElementCommand {

   protected final Property property;
   protected final int newLowerBound;
   protected final int newUpperBound;

   public SetAssociationEndMultiplicitySemanticCommand(final EditingDomain domain, final URI modelUri,
      final Property property, final int newLowerBound, final int newUpperBound) {
      super(domain, modelUri);
      this.property = property;
      this.newLowerBound = newLowerBound;
      this.newUpperBound = newUpperBound;
   }

   @Override
   protected void doExecute() {
      property.setLower(newLowerBound);
      property.setUpper(newUpperBound);
   }
}

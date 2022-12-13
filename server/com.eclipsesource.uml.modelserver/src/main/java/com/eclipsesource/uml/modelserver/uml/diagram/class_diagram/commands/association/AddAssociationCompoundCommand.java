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

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddEdgeCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;

public class AddAssociationCompoundCommand extends CompoundCommand {

   public AddAssociationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Type source, final Type target,
      final AssociationType type) {

      var command = new AddAssociationSemanticCommand(domain, modelUri, source,
         target, type);
      this.append(command);
      this.append(new UmlAddEdgeCommand(domain, modelUri, () -> command.getNewAssociation()));
   }

}

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
import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;

public class RemoveAssociationCompoundCommand extends CompoundCommand {

   public RemoveAssociationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Association association) {
      this.append(new RemoveAssociationSemanticCommand(domain, modelUri, association));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, association));

      // TODO Make sure to remove also all other AssociationEnds (not only the ownedByAssociation Ends!
   }
}

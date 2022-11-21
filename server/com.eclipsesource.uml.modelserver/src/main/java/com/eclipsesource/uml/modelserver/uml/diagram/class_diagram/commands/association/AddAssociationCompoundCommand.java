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

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;

public class AddAssociationCompoundCommand extends CompoundCommand {

   public AddAssociationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Class source, final Class target,
      final String type) {

      var command = new AddAssociationSemanticCommand(domain, modelUri, source,
         target, type);
      this.append(command);
      Supplier<Association> semanticResultSupplier = command::getNewAssociation;
      this.append(new AddAssociationNotationCommand(domain, modelUri, semanticResultSupplier));
   }

}

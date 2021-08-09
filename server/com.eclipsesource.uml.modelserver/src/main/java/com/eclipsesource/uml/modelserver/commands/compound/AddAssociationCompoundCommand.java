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
package com.eclipsesource.uml.modelserver.commands.compound;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.modelserver.commands.notation.AddAssociationEdgeCommand;
import com.eclipsesource.uml.modelserver.commands.semantic.AddAssociationCommand;

public class AddAssociationCompoundCommand extends CompoundCommand {

   public AddAssociationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String sourceClassUriFragment, final String targetClassUriFragment) {

      // Chain semantic and notation command
      AddAssociationCommand command = new AddAssociationCommand(domain, modelUri, sourceClassUriFragment,
         targetClassUriFragment);
      this.append(command);
      Supplier<Association> semanticResultSupplier = () -> command.getNewAssociation();
      this.append(new AddAssociationEdgeCommand(domain, modelUri, semanticResultSupplier));
   }

}

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
package com.eclipsesource.uml.modelserver.commands.semantic;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Type;

public class SetPropertyCommand extends CompoundCommand {

   public SetPropertyCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
      final String newName, final Type newType, final int newLowerBound, final int newUpperBound) {
      this.append(new SetPropertyNameCommand(domain, modelUri, semanticUriFragment, newName));
      this.append(new SetPropertyTypeCommand(domain, modelUri, semanticUriFragment, newType));
      this.append(new SetPropertyBoundsCommand(domain, modelUri, semanticUriFragment, newLowerBound, newUpperBound));
   }

}

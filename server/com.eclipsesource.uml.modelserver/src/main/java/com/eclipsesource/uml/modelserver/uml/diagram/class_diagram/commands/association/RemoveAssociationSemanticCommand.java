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
import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveAssociationSemanticCommand extends UmlSemanticElementCommand {

   protected final Association association;

   public RemoveAssociationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Association association) {
      super(domain, modelUri);
      this.association = association;
   }

   @Override
   protected void doExecute() {
      model.getPackagedElements().remove(association);
   }
}

/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.property;

import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeletePropertySemanticCommand extends BaseDeleteSemanticChildCommand<Association, Property> {

   public DeletePropertySemanticCommand(final ModelContext context, final Property semanticElement) {
      super(context, semanticElement.getAssociation(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Association parent, final Property child) {
      parent.getAttributes().remove(child);
   }
}

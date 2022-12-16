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

import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemovePropertySemanticCommand extends UmlSemanticElementCommand {

   protected final AttributeOwner parent;
   protected final Property property;

   public RemovePropertySemanticCommand(final ModelContext context,
      final AttributeOwner parent,
      final Property property) {
      super(context);
      this.parent = parent;
      this.property = property;
   }

   @Override
   protected void doExecute() {
      parent.getOwnedAttributes().remove(property);
   }

}

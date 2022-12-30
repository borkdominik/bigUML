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

import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseSemanticElementCommand;

public final class UpdatePropertyMultiplicitySemanticCommand extends BaseSemanticElementCommand {

   protected final Property property;
   protected final int newLowerBound;
   protected final int newUpperBound;

   public UpdatePropertyMultiplicitySemanticCommand(final ModelContext context,
      final Property property,
      final int newLowerBound, final int newUpperBound) {
      super(context);
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

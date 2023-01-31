/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.property;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertyMultiplicityContribution;

public final class UpdatePropertyBoundsHandler
   extends BaseUpdateElementHandler<Property, UpdatePropertyBoundsHandler.Args> {

   public UpdatePropertyBoundsHandler() {
      super(UmlClass_Property.Property.MULTIPLICITY);
   }

   public static class Args {
      public String bounds;

      public Args(final String bounds) {
         this.bounds = bounds;
      }
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Property element, final Args args) {
      var bound = args.bounds;

      return UpdatePropertyMultiplicityContribution.create(
         element,
         PropertyUtil.getLower(bound),
         PropertyUtil.getUpper(bound));
   }

}

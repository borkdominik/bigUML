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
package com.eclipsesource.uml.glsp.uml.handler.operations.update;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.modelserver.core.commands.rename.UmlRenameElementContribution;

@Deprecated(forRemoval = true)
public abstract class UpdateNamedElementNameHandler<T extends NamedElement>
   extends BaseUpdateElementHandler<T, UpdateNamedElementNameHandler.Args> {

   public UpdateNamedElementNameHandler(final String propertyId) {
      super(propertyId);
   }

   public static class Args {
      public String name;

      public Args(final String name) {
         this.name = name;
      }
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final T element, final Args args) {
      return UmlRenameElementContribution.create(element, args.name);
   }

}

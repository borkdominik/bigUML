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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClassPackage;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.commands.RenameElementContribution;

public final class UpdatePackageNameHandler extends BaseUpdateElementHandler<Package, UpdatePackageNameHandler.Args> {

   public UpdatePackageNameHandler() {
      super(UmlClassPackage.Property.NAME, UpdatePackageNameHandler.Args.class);
   }

   public static class Args {
      public String text;

      public Args() {}

      public Args(final String text) {
         this.text = text;
      }
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final Package element, final Args args) {
      return RenameElementContribution.create(element, args.text);
   }

}

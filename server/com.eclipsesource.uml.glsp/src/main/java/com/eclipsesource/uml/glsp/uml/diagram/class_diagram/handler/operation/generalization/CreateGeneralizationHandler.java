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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.generalization;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.AddClassGeneralizationContribution;

public class CreateGeneralizationHandler
   extends BaseCreateEdgeHandler<Class, Class> {

   public CreateGeneralizationHandler() {
      super(ClassTypes.CLASS_GENERALIZATION);
   }

   @Override
   protected CCommand command(final Class source, final Class target) {
      return AddClassGeneralizationContribution.create(source, target);
   }

}

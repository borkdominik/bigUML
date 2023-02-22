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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.realization;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Realization;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.realization.CreateRealizationContribution;

public final class CreateRealizationHandler
   extends BaseCreateEdgeHandler<NamedElement, NamedElement> {

   public CreateRealizationHandler() {
      super(UmlClass_Realization.TYPE_ID);
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final NamedElement source,
      final NamedElement target) {
      return CreateRealizationContribution.create(source, target);
   }

}

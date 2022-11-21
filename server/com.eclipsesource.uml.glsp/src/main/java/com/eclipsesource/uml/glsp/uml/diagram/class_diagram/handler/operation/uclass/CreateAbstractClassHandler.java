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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.uclass;

import java.util.Optional;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass.AddClassContribution;

public class CreateAbstractClassHandler
   extends BaseCreateNodeHandler {

   public CreateAbstractClassHandler() {
      super(ClassTypes.ABSTRACT_CLASS);
   }

   @Override
   protected CCommand command(final Optional<GPoint> location) {
      return AddClassContribution
         .create(location.orElse(GraphUtil.point(0, 0)), true);
   }
}

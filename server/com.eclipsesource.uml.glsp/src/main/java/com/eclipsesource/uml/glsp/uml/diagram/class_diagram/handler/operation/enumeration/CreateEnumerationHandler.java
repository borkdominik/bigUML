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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration;

import java.util.Optional;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.AddEnumerationContribution;

public class CreateEnumerationHandler
   extends BaseCreateNodeHandler {

   public CreateEnumerationHandler() {
      super(ClassTypes.ENUMERATION);
   }

   @Override
   protected CCommand command(final Optional<GPoint> location) {
      return AddEnumerationContribution.create(location.orElse(GraphUtil.point(0, 0)));
   }
}
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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.util.GraphUtil;

import com.eclipsesource.uml.modelserver.commands.commons.notation.AddGenericShapeCommand;

public class AddParameterCompoundCommand extends CompoundCommand {

   public AddParameterCompoundCommand(final EditingDomain domain, final URI modelUri, final String actionUri) {

      // Chain semantic and notation command
      AddParameterCommand command = new AddParameterCommand(domain, modelUri, actionUri);
      this.append(command);
      this.append(new AddGenericShapeCommand(domain, modelUri, GraphUtil.point(0, 20), command));
   }

}

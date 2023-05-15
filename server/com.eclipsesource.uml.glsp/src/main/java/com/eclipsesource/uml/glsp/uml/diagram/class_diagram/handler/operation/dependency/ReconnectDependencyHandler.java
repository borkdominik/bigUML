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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.dependency;

import java.util.Set;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.uml.handler.operations.reconnect_edge.BaseReconnectEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.dependency.UpdateDependencyArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.dependency.UpdateDependencyContribution;

public final class ReconnectDependencyHandler extends BaseReconnectEdgeHandler<Dependency, NamedElement, NamedElement> {

   @Override
   protected CCommand createCommand(final ReconnectEdgeOperation operation, final Dependency element,
      final NamedElement source,
      final NamedElement target) {
      return UpdateDependencyContribution.create(element,
         new UpdateDependencyArgument.Builder()
            .clients(Set.of(source), idGenerator)
            .suppliers(Set.of(target), idGenerator)
            .get());
   }

}

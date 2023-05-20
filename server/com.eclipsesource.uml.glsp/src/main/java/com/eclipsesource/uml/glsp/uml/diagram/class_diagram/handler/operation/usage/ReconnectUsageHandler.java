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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.usage;

import java.util.Set;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.glsp.uml.handler.operations.reconnect_edge.BaseReconnectEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.usage.UpdateUsageArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.usage.UpdateUsageContribution;

public final class ReconnectUsageHandler
   extends BaseReconnectEdgeHandler<Usage, NamedElement, NamedElement> {

   @Override
   protected CCommand createCommand(final ReconnectEdgeOperation operation, final Usage element,
      final NamedElement source,
      final NamedElement target) {
      return UpdateUsageContribution.create(element,
         new UpdateUsageArgument.Builder()
            .clients(Set.of(source), idGenerator)
            .suppliers(Set.of(target), idGenerator)
            .get());
   }
}

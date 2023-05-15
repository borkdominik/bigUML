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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association;

import java.util.List;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.glsp.uml.handler.operations.reconnect_edge.BaseReconnectEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.UpdateAssociationArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.UpdateAssociationContribution;

public final class ReconnectAssociationHandler extends BaseReconnectEdgeHandler<Association, Type, Type> {

   @Override
   protected CCommand createCommand(final ReconnectEdgeOperation operation, final Association element,
      final Type source,
      final Type target) {
      return UpdateAssociationContribution.create(element,
         new UpdateAssociationArgument.Builder()
            .endTypeIds(List.of(idGenerator.getOrCreateId(source), idGenerator.getOrCreateId(target))).get());
   }

}

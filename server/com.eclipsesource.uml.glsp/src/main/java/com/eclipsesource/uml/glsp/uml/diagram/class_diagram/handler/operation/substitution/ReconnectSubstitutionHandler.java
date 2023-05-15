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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.substitution;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Substitution;

import com.eclipsesource.uml.glsp.uml.handler.operations.reconnect_edge.BaseReconnectEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.substitution.UpdateSubstitutionArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.substitution.UpdateSubstitutionContribution;

public final class ReconnectSubstitutionHandler
   extends BaseReconnectEdgeHandler<Substitution, Classifier, Classifier> {

   @Override
   protected CCommand createCommand(final ReconnectEdgeOperation operation, final Substitution element,
      final Classifier source,
      final Classifier target) {
      return UpdateSubstitutionContribution.create(element,
         new UpdateSubstitutionArgument.Builder()
            .substitutedClassifier(source, idGenerator)
            .contract(target, idGenerator)
            .get());
   }
}

/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.communication_path;

import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.handler.element.EdgeOperationHandler;
import com.eclipsesource.uml.modelserver.uml.elements.association.constants.AssociationType;
import com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands.CreateCommunicationPathArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class CommunicationPathOperationHandler
   extends EdgeOperationHandler<CommunicationPath, Node, Node> {

   @Inject
   public CommunicationPathOperationHandler(@Assisted final Representation representation,
      final ElementConfigurationRegistry registry) {
      super(representation, registry.accessTyped(representation, CommunicationPath.class).typeId());
   }

   @Override
   protected Object createArgument(final CreateEdgeOperation operation, final Node source, final Node target) {
      return new CreateCommunicationPathArgument(AssociationType.ASSOCIATION);
   }

}

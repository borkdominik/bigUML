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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.matcher.CommunicationDiagramCrossReferenceRemover;

public class RemovePrimitiveTypeCompoundCommand extends CompoundCommand {

   public RemovePrimitiveTypeCompoundCommand(final ModelContext context,
      final PrimitiveType primitiveType) {
      this.append(new RemovePrimitiveTypeSemanticCommand(context, primitiveType));
      this.append(new UmlRemoveNotationElementCommand(context, primitiveType));

      new CommunicationDiagramCrossReferenceRemover(context).removeCommandsFor(primitiveType)
         .forEach(this::append);
   }
}

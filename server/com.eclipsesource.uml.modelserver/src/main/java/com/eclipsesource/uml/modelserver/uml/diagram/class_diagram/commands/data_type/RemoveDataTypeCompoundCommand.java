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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.matcher.CommunicationDiagramCrossReferenceRemover;

public final class RemoveDataTypeCompoundCommand extends CompoundCommand {

   public RemoveDataTypeCompoundCommand(final ModelContext context,
      final Package parent,
      final DataType semanticElement) {
      this.append(new RemoveDataTypeSemanticCommand(context, parent, semanticElement));
      this.append(new UmlRemoveNotationElementCommand(context, semanticElement));

      new CommunicationDiagramCrossReferenceRemover(context).removeCommandsFor(semanticElement)
         .forEach(this::append);
   }
}

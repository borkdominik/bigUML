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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher.ClassDiagramCrossReferenceRemover;

public class RemoveClassCompoundCommand extends CompoundCommand {

   public RemoveClassCompoundCommand(final ModelContext context, final Class classToRemove) {
      this.append(new RemoveClassSemanticCommand(context, classToRemove));
      this.append(new UmlRemoveNotationElementCommand(context, classToRemove));

      new ClassDiagramCrossReferenceRemover(context).removeCommandsFor(classToRemove)
         .forEach(this::append);
   }
}

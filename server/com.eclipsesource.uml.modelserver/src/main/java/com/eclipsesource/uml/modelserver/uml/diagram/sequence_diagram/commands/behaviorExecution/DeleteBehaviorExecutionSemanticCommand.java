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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution;

import org.eclipse.uml2.uml.BehaviorExecutionSpecification;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteBehaviorExecutionSemanticCommand
   extends BaseDeleteSemanticChildCommand<Interaction, BehaviorExecutionSpecification> {

   public DeleteBehaviorExecutionSemanticCommand(final ModelContext context,
      final BehaviorExecutionSpecification semanticElement) {
      super(context, semanticElement.getEnclosingInteraction(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Interaction parent, final BehaviorExecutionSpecification child) {

      var start = child.getStart();
      start.getCovereds().clear();

      var finish = child.getFinish();
      finish.getCovereds().clear();

      parent.getFragments().remove(start);
      parent.getFragments().remove(finish);
      parent.getFragments().remove(child);
   }
}

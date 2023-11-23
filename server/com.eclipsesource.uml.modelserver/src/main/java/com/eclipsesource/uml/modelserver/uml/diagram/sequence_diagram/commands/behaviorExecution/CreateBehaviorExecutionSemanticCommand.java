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

import java.util.function.Supplier;

import org.eclipse.uml2.uml.BehaviorExecutionSpecification;
import org.eclipse.uml2.uml.ExecutionOccurrenceSpecification;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.OccurrenceSpecification;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.shared.semantic.SDBaseCreateSemanticChildRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateBehaviorExecutionSemanticCommand
   extends
   SDBaseCreateSemanticChildRelationCommand<Lifeline, BehaviorExecutionSpecification, Supplier<OccurrenceSpecification>, Supplier<OccurrenceSpecification>> {

   public CreateBehaviorExecutionSemanticCommand(final ModelContext context, final Lifeline parent,
      final Supplier<OccurrenceSpecification> occurrenceSpecification,
      final Supplier<OccurrenceSpecification> occurrenceSpecification2) {
      super(context, parent, occurrenceSpecification, occurrenceSpecification2);
   }

   @Override
   protected BehaviorExecutionSpecification createSemanticElement(final Lifeline lifeline,
      final Supplier<OccurrenceSpecification> sourceSupplier,
      final Supplier<OccurrenceSpecification> targetSupplier) {
      var interaction = lifeline.getInteraction();
      var nameGenerator = new ListNameGenerator(BehaviorExecutionSpecification.class, interaction.getFragments());

      var executionSpecification = (BehaviorExecutionSpecification) interaction.createFragment(nameGenerator.newName(),
         UMLPackage.Literals.BEHAVIOR_EXECUTION_SPECIFICATION);

      var source = sourceSupplier.get();
      var target = targetSupplier.get();

      executionSpecification.setEnclosingInteraction(interaction);
      executionSpecification.setStart(source);
      executionSpecification.setFinish(target);
      var test = executionSpecification.getCovereds();
      var test2 = executionSpecification.getCovereds().add(lifeline);
      if (source instanceof ExecutionOccurrenceSpecification) {
         ((ExecutionOccurrenceSpecification) source).setExecution(executionSpecification);
      }
      if (target instanceof ExecutionOccurrenceSpecification) {
         ((ExecutionOccurrenceSpecification) target).setExecution(executionSpecification);
      }

      return executionSpecification;
   }
}

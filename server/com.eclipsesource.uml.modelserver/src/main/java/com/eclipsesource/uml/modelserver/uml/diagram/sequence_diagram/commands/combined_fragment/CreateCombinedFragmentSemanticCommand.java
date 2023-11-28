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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.combined_fragment;

import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.InteractionFragment;
import org.eclipse.uml2.uml.InteractionOperand;
import org.eclipse.uml2.uml.InteractionOperatorKind;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateCombinedFragmentSemanticCommand
   extends BaseCreateSemanticChildCommand<InteractionFragment, CombinedFragment> {

   public CreateCombinedFragmentSemanticCommand(final ModelContext context, final InteractionFragment parent) {
      super(context, parent);
   }

   @Override
   protected CombinedFragment createSemanticElement(final InteractionFragment parent) {

      CombinedFragment combinedFragment;

      if (parent instanceof Interaction) {

         var nameGenerator = new ListNameGenerator(CombinedFragment.class,
            ((Interaction) parent).getFragments());

         combinedFragment = (CombinedFragment) ((Interaction) parent).createFragment(nameGenerator.newName(),
            UMLPackage.Literals.COMBINED_FRAGMENT);
      } else {
         // parent instanceof InteractionOperand
         var nameGenerator = new ListNameGenerator(CombinedFragment.class,
            ((InteractionOperand) parent).getFragments());

         combinedFragment = (CombinedFragment) ((InteractionOperand) parent).createFragment(nameGenerator.newName(),
            UMLPackage.Literals.COMBINED_FRAGMENT);
      }

      // creating alt, since most popular
      combinedFragment.setInteractionOperator(InteractionOperatorKind.ALT_LITERAL);
      return combinedFragment;
   }
}

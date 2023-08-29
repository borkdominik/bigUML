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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.reference;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.modelserver.shared.matcher.BaseCrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition.DeleteTransitionCompoundCommand;

public class TransitionReferenceRemover extends BaseCrossReferenceProcessor<Transition> {

   @Override
   protected List<Command> process(final ModelContext context, final Setting setting, final Transition self,
      final EObject interest) {
      return List.of(new DeleteTransitionCompoundCommand(context, self));
   }
}

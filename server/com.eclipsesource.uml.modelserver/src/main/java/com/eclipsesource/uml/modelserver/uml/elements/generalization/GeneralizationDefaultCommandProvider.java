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
package com.eclipsesource.uml.modelserver.uml.elements.generalization;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.BasicElementCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.generalization.commands.CreateGeneralizationSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.generalization.commands.UpdateGeneralizationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.generalization.commands.UpdateGeneralizationSemanticCommand;

public class GeneralizationDefaultCommandProvider extends BasicElementCommandProvider<Generalization> {

   @Override
   public Command provideCreateCommand(final ModelContext context) {
      var decoder = new ContributionDecoder(context);

      var source = decoder.source(Classifier.class).orElseThrow();
      var target = decoder.target(Classifier.class).orElseThrow();

      var semantic = new CreateGeneralizationSemanticCommand(context, source, target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);

      var command = new CompoundCommand();
      command.append(semantic);
      command.append(notation);
      return command;
   }

   @Override
   public Command provideUpdateCommand(final ModelContext context, final Generalization element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateGeneralizationArgument.class);

      var command = new CompoundCommand();
      command.append(new UpdateGeneralizationSemanticCommand(context, element, update));
      return command;
   }

}

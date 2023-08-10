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
package com.eclipsesource.uml.modelserver.uml.elements.subject;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.BasicElementCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.subject.commands.CreateSubjectSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.subject.commands.UpdateSubjectArgument;
import com.eclipsesource.uml.modelserver.uml.elements.subject.commands.UpdateSubjectSemanticCommand;

public class SubjectDefaultCommandProvider extends BasicElementCommandProvider<Component> {

   @Override
   public Command provideCreateCommand(final ModelContext context) {
      var decoder = new ContributionDecoder(context);

      var parent = decoder.parent(Model.class).orElseThrow();
      var position = decoder.position().orElseThrow();

      var semantic = new CreateSubjectSemanticCommand(context, parent);
      var notation = new AddShapeNotationCommand(
         context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));

      var command = new CompoundCommand();
      command.append(semantic);
      command.append(notation);
      return command;
   }

   @Override
   public Command provideUpdateCommand(final ModelContext context, final Component element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateSubjectArgument.class);

      var command = new CompoundCommand();
      command.append(new UpdateSubjectSemanticCommand(context, element, update));
      return command;
   }

}

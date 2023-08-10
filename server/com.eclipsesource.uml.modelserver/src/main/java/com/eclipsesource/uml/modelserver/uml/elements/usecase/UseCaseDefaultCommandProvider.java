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
package com.eclipsesource.uml.modelserver.uml.elements.usecase;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.BasicElementCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.CreateRootUseCaseSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.CreateUseCaseSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.UpdateUseCaseArgument;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.UpdateUseCaseSemanticCommand;

public class UseCaseDefaultCommandProvider extends BasicElementCommandProvider<UseCase> {

   @Override
   public Command provideCreateCommand(final ModelContext context) {
      var decoder = new ContributionDecoder(context);
      var command = new CompoundCommand();

      var position = decoder.position().orElseThrow();
      var parent = decoder.parent(Model.class);

      if (parent.isPresent()) {
         var semantic = new CreateRootUseCaseSemanticCommand(context, parent.get());
         var notation = new AddShapeNotationCommand(
            context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));

         command.append(semantic);
         command.append(notation);
      } else {
         var semantic = new CreateUseCaseSemanticCommand(context, decoder.parent(Component.class).orElseThrow());
         var notation = new AddShapeNotationCommand(
            context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));

         command.append(semantic);
         command.append(notation);
      }

      return command;
   }

   @Override
   public Command provideUpdateCommand(final ModelContext context, final UseCase element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateUseCaseArgument.class);

      var command = new CompoundCommand();
      command.append(new UpdateUseCaseSemanticCommand(context, element, update));
      return command;
   }

}

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

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.CreateRootUseCaseSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.CreateUseCaseSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.UpdateUseCaseArgument;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.UpdateUseCaseSemanticCommand;

public class UseCaseCommandProvider extends NodeCommandProvider<UseCase, EObject> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final EObject parent,
      final GPoint position) {

      if (parent instanceof Model) {
         var semantic = new CreateRootUseCaseSemanticCommand(context, (Model) parent);
         var notation = new AddShapeNotationCommand(
            context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));

         return List.of(semantic, notation);
      } else if (parent instanceof Component) {
         var semantic = new CreateUseCaseSemanticCommand(context, (Component) parent);
         var notation = new AddShapeNotationCommand(
            context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));

         return List.of(semantic, notation);
      }

      throw new IllegalArgumentException("Parent has to be either Model or Component");
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final UseCase element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateUseCaseArgument.class);
      return List.of(new UpdateUseCaseSemanticCommand(context, element, update));
   }

}

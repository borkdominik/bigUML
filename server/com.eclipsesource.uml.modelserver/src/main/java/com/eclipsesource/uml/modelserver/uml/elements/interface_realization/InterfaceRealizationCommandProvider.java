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
package com.eclipsesource.uml.modelserver.uml.elements.interface_realization;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.interface_realization.commands.CreateInterfaceRealizationSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.interface_realization.commands.UpdateInterfaceRealizationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.interface_realization.commands.UpdateInterfaceRealizationSemanticCommand;

public class InterfaceRealizationCommandProvider
   extends EdgeCommandProvider<InterfaceRealization, Class, Interface> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Class source,
      final Interface target) {
      var semantic = new CreateInterfaceRealizationSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final InterfaceRealization element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateInterfaceRealizationArgument.class);
      return List.of(new UpdateInterfaceRealizationSemanticCommand(context, element, update));
   }

}

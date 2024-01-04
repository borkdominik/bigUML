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
package com.eclipsesource.uml.modelserver.uml.elements.parameter;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Parameter;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.parameter.commands.CreateParameterSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.parameter.commands.UpdateParameterArgument;
import com.eclipsesource.uml.modelserver.uml.elements.parameter.commands.UpdateParameterSemanticCommand;

public class ParameterCommandProvider
   extends NodeCommandProvider<Parameter, Operation> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Operation parent,
      final GPoint position) {
      var semantic = new CreateParameterSemanticCommand(context, parent);
      var notation = new AddShapeNotationCommand(
         context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Parameter element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateParameterArgument.class);
      return List.of(new UpdateParameterSemanticCommand(context, element, update));
   }

}

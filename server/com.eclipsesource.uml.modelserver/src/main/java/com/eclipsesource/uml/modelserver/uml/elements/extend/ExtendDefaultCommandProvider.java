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
package com.eclipsesource.uml.modelserver.uml.elements.extend;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.uml2.uml.Extend;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.BasicElementCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.extend.commands.CreateExtendSemanticCommand;

public class ExtendDefaultCommandProvider extends BasicElementCommandProvider<Extend> {

   @Override
   public Command provideCreateCommand(final ModelContext context) {
      var decoder = new ContributionDecoder(context);

      var source = decoder.source(UseCase.class).orElseThrow();
      var target = decoder.target(UseCase.class).orElseThrow();

      var semantic = new CreateExtendSemanticCommand(context, source, target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);

      var command = new CompoundCommand();
      command.append(semantic);
      command.append(notation);
      return command;
   }

}

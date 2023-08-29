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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Vertex;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;

public class CreateTransitionContribution extends BasicCommandContribution<Command> {
   public static final String TYPE = "state_machine:add_transition";

   public static CCommand create(final Vertex source, final Vertex target) {
      return new ContributionEncoder().type(TYPE).source(source).target(target).ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var source = decoder.source(Vertex.class);
      var target = decoder.target(Vertex.class);

      if (source.isPresent() && target.isPresent()) {
         return new CreateTransitionCompoundCommand(context, source.get(), target.get());
      }

      return new NoopCommand();
   }

}

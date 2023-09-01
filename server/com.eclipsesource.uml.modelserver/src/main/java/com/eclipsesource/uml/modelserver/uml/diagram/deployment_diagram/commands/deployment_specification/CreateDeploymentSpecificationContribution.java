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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment_specification;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;

public final class CreateDeploymentSpecificationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "deployment:add_deployment_specification";

   public static CCommand create(final Object parent, final GPoint position) {
      return new ContributionEncoder().type(TYPE).parent(parent).position(position).ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var position = decoder.position().get();

      try {
         var parent = decoder.parent(Element.class);
         return parent
            .<Command> map(p -> new CreateDeploymentSpecificationCompoundCommand(context, p, position))
            .orElse(new NoopCommand());

      } catch (Exception e) {

         var parent = decoder.parent(Model.class);
         return parent
            .<Command> map(p -> new CreateDeploymentSpecificationCompoundCommand(context, p, position))
            .orElse(new NoopCommand());
      }
   }

}

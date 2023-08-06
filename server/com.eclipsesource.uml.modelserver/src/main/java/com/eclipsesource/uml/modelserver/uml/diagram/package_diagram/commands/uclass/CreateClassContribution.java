/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.uclass;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;

public final class CreateClassContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "package:add_class";
   private static final String IS_ABSTRACT = "is_abstract";

   public static CCommand create(final Package parent, final GPoint position, final Boolean isAbstract) {
      return new ContributionEncoder()
         .type(TYPE)
         .parent(parent)
         .position(position)
         .extra(IS_ABSTRACT, isAbstract.toString())
         .ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var parent = decoder.parent(Package.class);
      var position = decoder.position().get();
      var isAbstract = Boolean.parseBoolean(decoder.extra(IS_ABSTRACT));

      return parent
         .<Command> map(p -> new CreateClassCompoundCommand(context, p, position, isAbstract))
         .orElse(new NoopCommand());
   }

}

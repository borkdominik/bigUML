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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;

public final class AddAssociationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:add_association";
   private static final String TYPE_KEYWORD = "type_keyword";

   public static CCompoundCommand create(final Type source, final Type target,
      final AssociationType keyword) {
      return new ContributionEncoder().type(TYPE).source(source).target(target).extra(TYPE_KEYWORD, keyword.name())
         .ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var source = decoder.source(Type.class);
      var target = decoder.target(Type.class);
      var type = AssociationType.valueOf(decoder.extra(TYPE_KEYWORD));

      if (source.isPresent() && target.isPresent()) {
         return new AddAssociationCompoundCommand(context, source.get(), target.get(), type);
      }

      return new NoopCommand();
   }

}

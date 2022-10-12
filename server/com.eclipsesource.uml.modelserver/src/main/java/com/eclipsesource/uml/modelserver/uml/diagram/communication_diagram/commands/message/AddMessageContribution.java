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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.uml.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.uml.util.UmlSemanticCommandUtil;

public class AddMessageContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "add_message";

   public static final String SOURCE_LIFELINE_URI_FRAGMENT = "source_lifeline_uri_fragment";
   public static final String TARGET_LIFELINE_URI_FRAGMENT = "target_lifeline_uri_fragment";

   public static CCompoundCommand create(final Lifeline sourceLifeline, final Lifeline targetLifeline) {
      var command = CCommandFactory.eINSTANCE.createCompoundCommand();

      command.setType(TYPE);
      command.getProperties().put(SOURCE_LIFELINE_URI_FRAGMENT,
         UmlSemanticCommandUtil.getSemanticUriFragment(sourceLifeline));
      command.getProperties().put(TARGET_LIFELINE_URI_FRAGMENT,
         UmlSemanticCommandUtil.getSemanticUriFragment(targetLifeline));

      return command;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      var elementAccessor = new SemanticElementAccessor(modelUri, domain);

      var sourceLifelineUriFragment = command.getProperties().get(SOURCE_LIFELINE_URI_FRAGMENT);
      var targetLifelineUriFragment = command.getProperties().get(TARGET_LIFELINE_URI_FRAGMENT);

      var sourceLifeline = elementAccessor.getElement(sourceLifelineUriFragment, Lifeline.class);
      var targetLifeline = elementAccessor.getElement(targetLifelineUriFragment, Lifeline.class);

      return new AddMessageCompoundCommand(domain, modelUri, sourceLifeline, targetLifeline);
   }

}

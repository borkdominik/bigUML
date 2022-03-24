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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.datanode;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;

public class AddParameterCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addParameter";
   private static final String PARENT_URI = "parentUri";

   public static CCompoundCommand create(final String activityUri) {
      CCompoundCommand addPartitionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addPartitionCommand.setType(TYPE);
      addPartitionCommand.getProperties().put(PARENT_URI, activityUri);
      return addPartitionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      final String activityUri = command.getProperties().get(PARENT_URI);
      return new AddParameterCompoundCommand(domain, modelUri, activityUri);
   }

}

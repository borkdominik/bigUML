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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.datanode;

public class AddPinCommandContribution { /*-

   public static final String TYPE = "addPin";
   private static final String PARENT_URI = "parentUri";

   public static CCompoundCommand create(final String actionUri) {
      CCompoundCommand addPartitionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addPartitionCommand.setType(TYPE);
      addPartitionCommand.getProperties().put(PARENT_URI, actionUri);
      return addPartitionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      final String actionUri = command.getProperties().get(PARENT_URI);
      return new AddPinCompoundCommand(domain, modelUri, actionUri);
   }
   */
}

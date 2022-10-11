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
package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.state;

public class AddStateCommandContribution { /*-{

   public static final String TYPE = "addStateContributuion";

   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "parentSemanticUriFragment";

   public static CCompoundCommand create(final String parentSemanticUri, final GPoint position) {
      CCompoundCommand addStateCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addStateCommand.setType(TYPE);
      addStateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
         String.valueOf(position.getX()));
      addStateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
         String.valueOf(position.getY()));

      addStateCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
      return addStateCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      GPoint statePosition = UmlNotationCommandUtil.getGPoint(
         command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
         command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentRegionUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);

      return new AddStateCompoundCommand(domain, modelUri, statePosition, parentRegionUriFragment);
   }
   */
}

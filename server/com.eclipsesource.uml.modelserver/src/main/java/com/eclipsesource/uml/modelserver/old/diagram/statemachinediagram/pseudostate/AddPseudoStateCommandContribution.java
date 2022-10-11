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
package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.pseudostate;

public class AddPseudoStateCommandContribution { /*-{

   public static final String TYPE = "addPseudostateContributuion";

   public static final String PARENT_SEMANTIC_URI_FRAGMENT = "parentSemanticUriFragment";

   public static final String PSEUDOSTATE_KIND = "pseudostateKind";

   public static CCompoundCommand create(final String parentSemanticUri, final PseudostateKind pseudostateKind,
      final GPoint position) {
      CCompoundCommand addPseudostateCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addPseudostateCommand.setType(TYPE);
      addPseudostateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
         String.valueOf(position.getX()));
      addPseudostateCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
         String.valueOf(position.getY()));

      addPseudostateCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
      addPseudostateCommand.getProperties().put(PSEUDOSTATE_KIND, pseudostateKind.getLiteral());
      return addPseudostateCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      GPoint pseudostatePosition = UmlNotationCommandUtil.getGPoint(
         command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
         command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentRegionUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
      PseudostateKind pseudostateKind = PseudostateKind.get(command.getProperties().get(PSEUDOSTATE_KIND));

      return new AddPseudoStateCompoundCommand(domain, modelUri, pseudostatePosition, parentRegionUriFragment,
         pseudostateKind);
   }   */

}

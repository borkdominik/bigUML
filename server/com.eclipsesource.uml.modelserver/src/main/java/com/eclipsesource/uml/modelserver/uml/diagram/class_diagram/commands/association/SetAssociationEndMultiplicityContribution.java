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
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.util.ClassSemanticCommandUtil;

public class SetAssociationEndMultiplicityContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:set_association_end_multiplicity";
   public static final String NEW_BOUNDS = "new_bounds";

   public static CCommand create(final Property property, final String newBounds) {
      var command = CCommandFactory.eINSTANCE.createCommand();

      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(property));
      command.getProperties().put(NEW_BOUNDS, newBounds);

      return command;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var elementAccessor = new SemanticElementAccessor(modelUri, domain);

      var semanticElementId = command.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
      int newLowerBound = ClassSemanticCommandUtil.getLower(command.getProperties().get(NEW_BOUNDS));
      int newUpperBound = ClassSemanticCommandUtil.getUpper(command.getProperties().get(NEW_BOUNDS));

      var property = elementAccessor.getElement(semanticElementId, Property.class);

      return property
         .<Command> map(p -> new SetAssociationEndMultiplicitySemanticCommand(domain, modelUri, p, newLowerBound,
            newUpperBound))
         .orElse(new NoopCommand());
   }
}

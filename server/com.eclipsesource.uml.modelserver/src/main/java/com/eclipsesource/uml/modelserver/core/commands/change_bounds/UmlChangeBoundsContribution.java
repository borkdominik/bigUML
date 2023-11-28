/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.commands.change_bounds;

import java.util.Map;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.types.ElementAndBounds;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.core.commands.SDChangeBoundsCompoundCommand;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UmlChangeBoundsContribution extends BasicCommandContribution<Command> {
   public static final String TYPE = "uml:change_bounds";

   public static CCommand create(final Representation representation, final String semanticElementId,
      final GPoint position) {
      return new ContributionEncoder().type(TYPE).representation(representation).element(semanticElementId)
         .position(position)
         .ccommand();
   }

   public static CCommand create(final Representation representation, final String semanticElementId,
      final GDimension size) {
      return new ContributionEncoder().type(TYPE).representation(representation).element(semanticElementId)
         .dimension(size).ccommand();
   }

   public static CCommand create(final Representation representation, final String semanticElementId,
      final GPoint position, final GDimension size) {
      return new ContributionEncoder().type(TYPE).representation(representation).element(semanticElementId)
         .position(position).dimension(size)
         .ccommand();
   }

   public static CCommand create(final Representation representation,
      final Map<Shape, ElementAndBounds> changeBoundsMap) {
      var compoundCommand = new ContributionEncoder().type(TYPE).representation(representation).ccompoundCommand();

      changeBoundsMap.forEach((shape, elementAndBounds) -> {
         var changeBoundsCommand = create(
            representation,
            shape.getSemanticElement().getElementId(),
            elementAndBounds.getNewPosition(),
            elementAndBounds.getNewSize());

         compoundCommand.getCommands().add(changeBoundsCommand);
      });

      return compoundCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var representation = context.representation();

      if (representation == Representation.SEQUENCE) {
         return new SDChangeBoundsCompoundCommand(context);
      }

      return new UmlChangeBoundsCompoundCommand(context);
   }

}

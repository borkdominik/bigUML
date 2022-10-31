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
import java.util.Optional;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.types.ElementAndBounds;

import com.eclipsesource.uml.modelserver.shared.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.utils.UmlGraphUtil;

public class UmlChangeBoundsContribution extends BasicCommandContribution<Command> {
   public static final String TYPE = "uml:changeBounds";

   protected static CCommand create(final String semanticElementId) {
      var changeBoundsCommand = CCommandFactory.eINSTANCE.createCommand();

      changeBoundsCommand.setType(TYPE);
      changeBoundsCommand.getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID, semanticElementId);

      return changeBoundsCommand;
   }

   public static CCommand create(final String semanticElementId, final GPoint position, final GDimension size) {
      var changeBoundsCommand = create(semanticElementId);

      changeBoundsCommand.getProperties().put(NotationKeys.POSITION_X, String.valueOf(position.getX()));
      changeBoundsCommand.getProperties().put(NotationKeys.POSITION_Y, String.valueOf(position.getY()));
      changeBoundsCommand.getProperties().put(NotationKeys.HEIGHT, String.valueOf(size.getHeight()));
      changeBoundsCommand.getProperties().put(NotationKeys.WIDTH, String.valueOf(size.getWidth()));

      return changeBoundsCommand;
   }

   public static CCommand create(final String semanticElementId, final GPoint position) {
      var changeBoundsCommand = create(semanticElementId);

      changeBoundsCommand.getProperties().put(NotationKeys.POSITION_X, String.valueOf(position.getX()));
      changeBoundsCommand.getProperties().put(NotationKeys.POSITION_Y, String.valueOf(position.getY()));

      return changeBoundsCommand;
   }

   public static CCommand create(final String semanticElementId, final GDimension size) {
      var changeBoundsCommand = create(semanticElementId);

      changeBoundsCommand.getProperties().put(NotationKeys.HEIGHT, String.valueOf(size.getHeight()));
      changeBoundsCommand.getProperties().put(NotationKeys.WIDTH, String.valueOf(size.getWidth()));

      return changeBoundsCommand;
   }

   public static CCompoundCommand create(final Map<Shape, ElementAndBounds> changeBoundsMap) {
      var compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();

      compoundCommand.setType(TYPE);
      changeBoundsMap.forEach((shape, elementAndBounds) -> {
         var changeBoundsCommand = create(
            shape.getSemanticElement().getElementId(),
            elementAndBounds.getNewPosition(), elementAndBounds.getNewSize());
         compoundCommand.getCommands().add(changeBoundsCommand);
      });

      return compoundCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      if (command instanceof CCompoundCommand) {
         var changeBoundsCommand = new CompoundCommand();

         ((CCompoundCommand) command).getCommands().forEach(childCommand -> {
            var semanticElementId = childCommand.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
            var elementPosition = getElementPosition(childCommand);
            var elementSize = getElementSize(childCommand);

            changeBoundsCommand
               .append(new UmlChangeBoundsCommand(domain, modelUri, semanticElementId, elementPosition, elementSize));
         });

         return changeBoundsCommand;
      }

      var semanticElementId = command.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
      var elementPosition = getElementPosition(command);
      var elementSize = getElementSize(command);
      return new UmlChangeBoundsCommand(domain, modelUri, semanticElementId, elementPosition, elementSize);
   }

   protected Optional<GPoint> getElementPosition(final CCommand command) {
      if (command.getProperties().containsKey(NotationKeys.POSITION_X)
         && command.getProperties().containsKey(NotationKeys.POSITION_Y)) {
         return Optional.of(UmlGraphUtil.getGPoint(command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y)));
      }
      return Optional.empty();
   }

   protected Optional<GDimension> getElementSize(final CCommand command) {
      if (command.getProperties().containsKey(NotationKeys.WIDTH)
         && command.getProperties().containsKey(NotationKeys.HEIGHT)) {
         return Optional.of(UmlGraphUtil.getGDimension(
            command.getProperties().get(NotationKeys.WIDTH), command.getProperties().get(NotationKeys.HEIGHT)));
      }
      return Optional.empty();
   }

}

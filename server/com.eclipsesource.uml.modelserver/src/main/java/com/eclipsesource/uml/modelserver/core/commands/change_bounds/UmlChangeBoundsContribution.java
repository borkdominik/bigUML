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

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;

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
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
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
      var context = ModelContext.of(modelUri, domain);
      var changeBoundsCompoundCommand = new CompoundCommand();
      var bounds = new ArrayList<ElementAndBounds>();

      if (command instanceof CCompoundCommand) {
         var compoundCommand = ((CCompoundCommand) command);

         var newBounds = compoundCommand.getCommands().stream().map(childCommand -> {
            return getBound(childCommand);
         }).collect(Collectors.toList());
         bounds.addAll(newBounds);

         newBounds.forEach(bound -> {
            var changeBoundsCommand = getChangeBoundsCommand(context, bound);

            changeBoundsCompoundCommand
               .append(changeBoundsCommand);
         });
      } else {
         var bound = getBound(command);

         bounds.add(bound);

         changeBoundsCompoundCommand
            .append(getChangeBoundsCommand(context, bound));
      }

      changeBoundsCompoundCommand
         .append(new UmlWrapBoundsCommand(context, bounds));
      return changeBoundsCompoundCommand;
   }

   protected ElementAndBounds getBound(final CCommand command) {
      var semanticElementId = command.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
      var elementPosition = getElementPosition(command);
      var elementSize = getElementSize(command);

      Consumer<ElementAndBounds> init = (that) -> {
         that.setElementId(semanticElementId);
         that.setNewPosition(elementPosition);
         that.setNewSize(elementSize);
      };

      return new ElementAndBounds(init);
   }

   protected Command getChangeBoundsCommand(final ModelContext context,
      final ElementAndBounds bound) {
      var semanticElementAccessor = new SemanticElementAccessor(context);

      var element = semanticElementAccessor.getElement(bound.getElementId(), Element.class);

      return element.<Command> map(e -> new UmlChangeBoundsNotationCommand(context, e,
         Optional.ofNullable(bound.getNewPosition()), Optional.of(bound.getNewSize())))
         .orElse(new NoopCommand("No element found for " + bound.getElementId()));
   }

   protected GPoint getElementPosition(final CCommand command) {
      if (command.getProperties().containsKey(NotationKeys.POSITION_X)
         && command.getProperties().containsKey(NotationKeys.POSITION_Y)) {
         return UmlGraphUtil.getGPoint(command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y));
      }
      return null;
   }

   protected GDimension getElementSize(final CCommand command) {
      if (command.getProperties().containsKey(NotationKeys.WIDTH)
         && command.getProperties().containsKey(NotationKeys.HEIGHT)) {
         return UmlGraphUtil.getGDimension(
            command.getProperties().get(NotationKeys.WIDTH), command.getProperties().get(NotationKeys.HEIGHT));
      }
      return null;
   }

}

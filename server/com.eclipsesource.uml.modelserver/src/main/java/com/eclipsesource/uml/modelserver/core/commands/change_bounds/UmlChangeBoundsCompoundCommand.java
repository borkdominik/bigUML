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
package com.eclipsesource.uml.modelserver.core.commands.change_bounds;

import java.util.ArrayList;
import java.util.Optional;
import java.util.function.Consumer;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.MessageEnd;
import org.eclipse.uml2.uml.MessageSort;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class UmlChangeBoundsCompoundCommand extends CompoundCommand {

   protected final ModelContext context;
   protected final ContributionDecoder decoder;
   protected final SemanticElementAccessor semanticElementAccessor;
   protected final NotationElementAccessor notationElementAccessor;

   public UmlChangeBoundsCompoundCommand(final ModelContext context) {
      this.context = context;
      this.decoder = new ContributionDecoder(context);
      this.semanticElementAccessor = new SemanticElementAccessor(context);
      this.notationElementAccessor = new NotationElementAccessor(context);

      var command = context.command;
      var bounds = new ArrayList<ElementAndBounds>();

      if (command instanceof CCompoundCommand) {
         var compoundCommand = ((CCompoundCommand) command);

         compoundCommand.getCommands().stream()
            .map(this::getBound)
            .forEach(bounds::add);
      } else {
         bounds.add(getBound(command));
      }

      bounds.forEach(bound -> {
         append(createCommand(bound));
      });

      append(new UmlSequenceWrapBoundsCommand(context, bounds));
      append(new UmlSequenceWrapBoundsCommand(context, bounds));
   }

   private ElementAndBounds getBound(final CCommand command) {
      var commandDecoder = decoder.with(command);
      var semanticElementId = commandDecoder.elementId().get();
      var elementPosition = commandDecoder.position().orElse(null);
      var elementSize = commandDecoder.dimension().orElse(null);

      Consumer<ElementAndBounds> init = (that) -> {
         that.setElementId(semanticElementId);
         that.setNewPosition(elementPosition);
         that.setNewSize(elementSize);
      };

      return new ElementAndBounds(init);
   }

   private Command createCommand(final ElementAndBounds bound) {
      var element = semanticElementAccessor.getElement(bound.getElementId(), Element.class);

      if (element.isEmpty()) {
         return new UmlChangeBoundsNotationCommand(
            context,
            Optional.ofNullable(bound.getElementId()),
            Optional.ofNullable(bound.getNewPosition()),
            Optional.ofNullable(bound.getNewSize()));
      }

      if (element.get() instanceof Lifeline
         && ((Lifeline) element.get()).getCoveredBys().stream()
            .filter(f -> (f instanceof MessageEnd)
               && ((MessageEnd) f).getMessage().getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL
               && ((MessageEnd) f).getMessage().getReceiveEvent() == f)
            .count() == 0) {
         return element
            .<Command> map(e -> new UmlChangeBoundsNotationCommand(
               context,
               e,
               Optional.ofNullable(GraphUtil.point(bound.getNewPosition().getX(), 30)),
               Optional.ofNullable(bound.getNewSize())))
            .orElse(new NoopCommand("No element found for " + bound.getElementId()));
      }

      return element
         .<Command> map(e -> new UmlChangeBoundsNotationCommand(
            context,
            e,
            Optional.ofNullable(bound.getNewPosition()),
            Optional.ofNullable(bound.getNewSize())))
         .orElse(new NoopCommand("No element found for " + bound.getElementId()));
   }

}

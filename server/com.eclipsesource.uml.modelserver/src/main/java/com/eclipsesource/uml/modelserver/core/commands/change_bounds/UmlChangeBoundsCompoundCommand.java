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
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public final class UmlChangeBoundsCompoundCommand extends CompoundCommand {

   private final ModelContext context;
   private final ContributionDecoder decoder;

   public UmlChangeBoundsCompoundCommand(final ModelContext context) {
      this.context = context;
      this.decoder = new ContributionDecoder(context);

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
      append(new UmlWrapBoundsCommand(context, bounds));
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
      var semanticElementAccessor = new SemanticElementAccessor(context);
      var element = semanticElementAccessor.getElement(bound.getElementId(), Element.class);

      return element
         .<Command> map(e -> new UmlChangeBoundsNotationCommand(
            context,
            e,
            Optional.ofNullable(bound.getNewPosition()),
            Optional.ofNullable(bound.getNewSize())))
         .orElse(new NoopCommand("No element found for " + bound.getElementId()));
   }

}

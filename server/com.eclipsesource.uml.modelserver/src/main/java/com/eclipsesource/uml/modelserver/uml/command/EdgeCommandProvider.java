/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.command;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.NoSuchElementException;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.shared.semantic.CallbackSemanticCommand;
import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.eclipsesource.uml.modelserver.uml.reference.CrossReferenceRemover;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class EdgeCommandProvider<TElement extends EObject, TSource extends EObject, TTarget extends EObject>
   extends ElementCommandProvider<TElement> {

   @Inject
   protected TypeLiteral<TSource> sourceType;
   @Inject
   protected TypeLiteral<TTarget> targetType;

   @Override
   public Command provideCreateCommand(final ModelContext context) {
      var decoder = new ContributionDecoder(context);

      var source = decoder.source(Type.clazz(sourceType))
         .orElseThrow(() -> new NoSuchElementException(
            String.format("Could not decode source of type %s for id %s", Type.clazz(sourceType), decoder.sourceId())));
      var target = decoder.target(Type.clazz(targetType))
         .orElseThrow(() -> new NoSuchElementException(
            String.format("Could not decode target of type %s for id %s", Type.clazz(sourceType), decoder.targetId())));

      var command = new CompoundCommand();
      createModifications(context, source, target).forEach(command::append);
      return command;
   }

   protected abstract Collection<Command> createModifications(ModelContext context, TSource source, TTarget target);

   @Override
   public Command provideDeleteCommand(final ModelContext context, final TElement element) {
      var command = new CompoundCommand();
      deleteModifications(context, element).forEach(command::append);
      return command;
   }

   protected Collection<Command> deleteModifications(final ModelContext context, final TElement element) {
      var commands = new ArrayList<Command>(List.of(
         new CallbackSemanticCommand(context, c -> {
            EcoreUtil.delete(element);
         }),
         new DeleteNotationElementCommand(context, element)));
      new CrossReferenceRemover(context).deleteCommandsFor(element).forEach(commands::add);
      return commands;
   }

   @Override
   public Command provideUpdateCommand(final ModelContext context, final TElement element) {
      var command = new CompoundCommand();
      updateModifications(context, element).forEach(command::append);
      return command;
   }

   protected Collection<Command> updateModifications(final ModelContext context, final TElement element) {
      return List.of(new NoopCommand());
   }
}

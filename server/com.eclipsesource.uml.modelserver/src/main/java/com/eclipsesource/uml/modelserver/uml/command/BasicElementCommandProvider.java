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

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.shared.semantic.CallbackSemanticCommand;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.modelserver.uml.command.create.CreateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.reference.CrossReferenceRemover;

public abstract class BasicElementCommandProvider<TElement extends EObject>
   implements CreateCommandProvider<TElement>, DeleteCommandProvider<TElement>, UpdateCommandProvider<TElement> {

   protected final Class<TElement> elementType;

   public BasicElementCommandProvider() {
      elementType = GenericsUtil.getClassParameter(getClass(), BasicElementCommandProvider.class, 0);
   }

   @Override
   public Class<? extends EObject> getElementType() { return elementType; }

   @Override
   public Command provideDeleteCommand(final ModelContext context, final TElement element) {
      var command = new CompoundCommand();
      command.append(new CallbackSemanticCommand(context, c -> {
         EcoreUtil.delete(element);
      }));
      command.append(new DeleteNotationElementCommand(context, element));
      new CrossReferenceRemover(context).deleteCommandsFor(element).forEach(command::append);
      return command;
   }

   @Override
   public Command provideUpdateCommand(final ModelContext context, final TElement element) {
      return new NoopCommand();
   }
}

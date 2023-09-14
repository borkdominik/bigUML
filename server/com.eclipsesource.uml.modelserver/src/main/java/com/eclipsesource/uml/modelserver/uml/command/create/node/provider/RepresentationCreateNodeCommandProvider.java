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
package com.eclipsesource.uml.modelserver.uml.command.create.node.provider;

import java.util.Collection;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GPoint;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.eclipsesource.uml.modelserver.uml.command.create.node.CreateNodeCommandProvider;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class RepresentationCreateNodeCommandProvider<TElement extends EObject, TParent>
   implements CreateNodeCommandProvider<TElement, TParent> {
   @Inject
   protected TypeLiteral<TElement> elementType;
   @Inject
   protected TypeLiteral<TParent> parentType;

   @Override
   public Class<? extends TElement> getElementType() { return Type.clazz(elementType); }

   @Override
   public Class<TParent> getParentType() { return Type.clazz(parentType); }

   @Override
   public Command provideCreateNodeCommand(final ModelContext context) {
      var decoder = new ContributionDecoder(context);

      var parent = decoder.parent(getParentType()).orElseThrow();
      var position = decoder.position().orElseThrow();

      var command = new CompoundCommand();
      createModifications(context, parent, position).forEach(command::append);
      return command;
   }

   protected abstract Collection<Command> createModifications(ModelContext context, TParent parent, GPoint position);

}

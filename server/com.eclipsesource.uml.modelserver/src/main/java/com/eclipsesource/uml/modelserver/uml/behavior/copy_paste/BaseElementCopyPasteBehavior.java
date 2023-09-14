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
package com.eclipsesource.uml.modelserver.uml.behavior.copy_paste;

import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.eclipsesource.uml.modelserver.uml.command.copy_paste.UmlCopier;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class BaseElementCopyPasteBehavior<TElement extends EObject>
   implements ElementCopyPasteBehavior<TElement> {
   @Inject
   protected TypeLiteral<TElement> elementType;

   @Override
   public Class<? extends EObject> getElementType() { return Type.clazz(elementType); }

   @Override
   public List<Command> modifyReferences(final ModelContext context, final UmlCopier copier) {
      var commands = new ArrayList<Command>();
      var entries = copier.entrySet().stream().collect(Collectors.toUnmodifiableSet());
      for (var entry : entries) {
         if (getElementType().isAssignableFrom(entry.getKey().getClass())
            && getElementType().isAssignableFrom(entry.getValue().getClass())) {
            modifyElementReferences(context, copier, (Entry<TElement, TElement>) entry).forEach(commands::add);
         }
      }
      return commands;
   }

   protected List<Command> modifyElementReferences(final ModelContext context, final UmlCopier copier,
      final Entry<TElement, TElement> entry) {
      return List.of();
   }

   @Override
   public boolean shouldSuspend(final ModelContext context, final UmlCopier copier, final EObject original) {
      if (getElementType().equals(original.getClass())) {
         return this.shouldSuspendElement(context, copier, (TElement) original);
      }
      return false;
   }

   protected abstract boolean shouldSuspendElement(final ModelContext context, final UmlCopier copier,
      final TElement element);

   @Override
   public boolean removeFromSuspension(final ModelContext context, final UmlCopier copier, final EObject original) {
      if (elementType.getRawType().equals(original.getClass())) {
         return this.removeElementFromSuspension(context, copier, (TElement) original);
      }
      return false;
   }

   protected abstract boolean removeElementFromSuspension(final ModelContext context, final UmlCopier copier,
      final TElement element);

}

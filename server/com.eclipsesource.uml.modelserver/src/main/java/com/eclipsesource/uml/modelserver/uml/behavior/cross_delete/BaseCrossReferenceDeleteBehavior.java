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
package com.eclipsesource.uml.modelserver.uml.behavior.cross_delete;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProviderRegistry;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProviderRegistry;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

/**
 * Deletes the element if there is any reference to the deleted element
 */
public abstract class BaseCrossReferenceDeleteBehavior<TElement extends EObject>
   implements CrossReferenceDeleteBehavior<TElement> {
   @Inject
   protected TypeLiteral<TElement> elementType;
   @Inject
   protected DeleteCommandProviderRegistry deleteRegistry;
   @Inject
   protected UpdateCommandProviderRegistry updateRegistry;

   public BaseCrossReferenceDeleteBehavior() {}

   @Override
   public Class<TElement> getElementType() { return (Class<TElement>) elementType.getRawType(); }

   @Override
   public List<Command> process(final ModelContext context, final Setting setting, final EObject interest) {
      return crossRemove(context, setting, interest);
   }

   @Override
   public List<Command> crossRemove(final ModelContext context, final Setting setting, final EObject interest) {
      if (shouldHandle(context, setting, interest)) {
         return handle(context, setting, getElementType().cast(setting.getEObject()), interest);
      }

      return List.of();
   }

   protected abstract boolean shouldHandle(final ModelContext context, final Setting setting, final EObject interest);

   protected List<Command> handle(final ModelContext context,
      final Setting setting, final TElement self,
      final EObject interest) {
      var command = deleteProviderFor(context, self).provideDeleteCommand(context, self);
      return List.of(command);
   }

   protected <TCrossElement extends EObject> DeleteCommandProvider<TCrossElement> deleteProviderFor(
      final ModelContext context,
      final TCrossElement element) {
      return (DeleteCommandProvider<TCrossElement>) deleteRegistry
         .access(new RepresentationKey<>(context.representation(), element.getClass()));
   }

   protected <TCrossElement extends EObject> UpdateCommandProvider<TCrossElement> updateProviderFor(
      final ModelContext context,
      final TCrossElement element) {
      return (UpdateCommandProvider<TCrossElement>) updateRegistry
         .access(new RepresentationKey<>(context.representation(), element.getClass()));
   }
}

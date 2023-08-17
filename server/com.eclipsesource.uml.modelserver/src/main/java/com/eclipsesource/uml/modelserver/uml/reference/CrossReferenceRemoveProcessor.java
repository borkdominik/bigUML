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
package com.eclipsesource.uml.modelserver.uml.reference;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;

import com.eclipsesource.uml.modelserver.shared.matcher.BaseCrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProviderRegistry;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProviderRegistry;

public class CrossReferenceRemoveProcessor<TSelf extends EObject> extends BaseCrossReferenceProcessor<TSelf> {

   @Override
   protected List<Command> process(final ModelContext context,
      final Setting setting, final TSelf self,
      final EObject interest) {
      var command = deleteProviderFor(context, self).provideDeleteCommand(context, self);
      return List.of(command);
   }

   protected <TElement extends EObject> DeleteCommandProvider<TElement> deleteProviderFor(final ModelContext context,
      final TElement element) {
      var registry = context.injector.map(i -> i.getInstance(DeleteCommandProviderRegistry.class)).orElseThrow();

      return (DeleteCommandProvider<TElement>) registry
         .access(new RepresentationKey<>(context.representation(), element.getClass()));
   }

   protected <TElement extends EObject> UpdateCommandProvider<TElement> updateProviderFor(final ModelContext context,
      final TElement element) {
      var registry = context.injector.map(i -> i.getInstance(UpdateCommandProviderRegistry.class)).orElseThrow();

      return (UpdateCommandProvider<TElement>) registry
         .access(new RepresentationKey<>(context.representation(), element.getClass()));
   }
}

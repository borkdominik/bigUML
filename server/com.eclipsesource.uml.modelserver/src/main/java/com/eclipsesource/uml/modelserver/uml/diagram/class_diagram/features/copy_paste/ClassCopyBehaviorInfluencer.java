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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.features.copy_paste;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil.Copier;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.core.commands.copy_paste.CopyBehaviorInfluencer;
import com.eclipsesource.uml.modelserver.core.commands.copy_paste.UmlPasteSemanticElementCommand;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CallbackSemanticCommand;
import com.eclipsesource.uml.modelserver.shared.utils.TriFunction;

public class ClassCopyBehaviorInfluencer implements CopyBehaviorInfluencer {
   protected List<BiFunction<Collection<? extends EObject>, EObject, Boolean>> ignores = List.of(this::ignoreProperty);
   protected List<TriFunction<ModelContext, Copier, Map.Entry<EObject, EObject>, List<Command>>> modifiers = List
      .of(this::modifyAssociation);

   @Override
   public List<Command> modifyReferences(final ModelContext context, final Collection<? extends EObject> elements,
      final Copier copier) {
      var commands = new ArrayList<Command>();

      var entries = copier.entrySet().stream().collect(Collectors.toUnmodifiableSet());
      for (var entry : entries) {
         this.modifiers.stream().map(m -> m.apply(context, copier, entry)).forEach(commands::addAll);
      }

      return commands;
   }

   protected List<Command> modifyAssociation(final ModelContext context, final Copier copier,
      final Map.Entry<EObject, EObject> entry) {
      var commands = new ArrayList<Command>();

      if (entry.getKey() instanceof Association) {
         var key = (Association) entry.getKey();
         var value = (Association) entry.getValue();

         for (var i = 0; i < key.getMemberEnds().size(); i++) {
            var index = i;
            var end = key.getMemberEnds().get(index);

            if (!copier.containsKey(end)) {
               var copy = (Property) copier.copy(end);

               commands.addAll(List.of(
                  new CallbackSemanticCommand(context, (c) -> {
                     value.getMemberEnds().add(copy);
                     value.getMemberEnds().move(index, copy);
                  }),
                  new UmlPasteSemanticElementCommand(context, end, copy)));
            }
         }
      }

      return commands;
   }

   @Override
   public boolean shouldIgnore(final Collection<? extends EObject> elements, final EObject original) {
      return ignores.stream().anyMatch(i -> i.apply(elements, original));
   }

   protected boolean ignoreProperty(final Collection<? extends EObject> elements, final EObject original) {
      if (original instanceof Property) {
         var originalT = (Property) original;

         return originalT.getAssociation() != null && !elements.contains(originalT.getAssociation());
      }

      return false;
   }
}

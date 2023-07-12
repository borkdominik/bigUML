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
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.core.commands.copy_paste.CopyBehavior;
import com.eclipsesource.uml.modelserver.core.commands.copy_paste.UmlCopier;
import com.eclipsesource.uml.modelserver.core.commands.copy_paste.UmlPasteSemanticElementCommand;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CallbackSemanticCommand;

public class ClassCopyBehavior implements CopyBehavior {
   protected List<BiFunction<UmlCopier, EObject, Boolean>> ignores = List.of(this::ignoreProperty);
   protected List<BiFunction<UmlCopier, Map.Entry<EObject, EObject>, List<Command>>> modifiers = List
      .of(this::modifyAssociation);
   protected final ModelContext context;

   public ClassCopyBehavior(final ModelContext context) {
      this.context = context;
   }

   @Override
   public List<Command> modifyReferences(final UmlCopier copier) {
      var commands = new ArrayList<Command>();

      var entries = copier.entrySet().stream().collect(Collectors.toUnmodifiableSet());
      for (var entry : entries) {
         this.modifiers.stream().map(m -> m.apply(copier, entry)).forEach(commands::addAll);
      }

      return commands;
   }

   protected List<Command> modifyAssociation(final UmlCopier copier,
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
   public boolean shouldIgnore(final UmlCopier copier, final EObject original) {
      return ignores.stream().anyMatch(i -> i.apply(copier, original));
   }

   protected boolean ignoreProperty(final UmlCopier copier, final EObject original) {
      if (original instanceof Property) {
         var originalT = (Property) original;

         if (originalT.getAssociation() != null) {
            var association = originalT.getAssociation();

            var isSelected = copier.getSelectedElements().contains(association);
            var isAncestor = EcoreUtil.isAncestor(copier.getElementsToCopy(), association);
            return !(isSelected || isAncestor);
         }
      }

      return false;
   }
}

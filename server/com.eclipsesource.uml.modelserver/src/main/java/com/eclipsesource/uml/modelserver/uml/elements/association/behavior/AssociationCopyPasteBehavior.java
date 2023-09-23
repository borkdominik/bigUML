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
package com.eclipsesource.uml.modelserver.uml.elements.association.behavior;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CallbackSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.behavior.copy_paste.BaseElementCopyPasteBehavior;
import com.eclipsesource.uml.modelserver.uml.command.copy_paste.UmlCopier;
import com.eclipsesource.uml.modelserver.uml.command.copy_paste.CopyPasteSemanticElementCommand;

public class AssociationCopyPasteBehavior extends BaseElementCopyPasteBehavior<Association> {

   @Override
   protected List<Command> modifyElementReferences(final ModelContext context, final UmlCopier copier,
      final Map.Entry<Association, Association> entry) {
      var commands = new ArrayList<Command>();

      var key = entry.getKey();
      var value = entry.getValue();

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
               new CopyPasteSemanticElementCommand(context, end, copy)));
         }
      }

      return commands;
   }

   @Override
   protected boolean shouldSuspendElement(final ModelContext context, final UmlCopier copier,
      final Association element) {
      return true;
   }

   @Override
   protected boolean removeElementFromSuspension(final ModelContext context, final UmlCopier copier,
      final Association element) {
      var isSelected = copier.getSelectedElements().contains(element);
      var hasAllMembers = element.getMemberEnds().stream()
         .allMatch(end -> copier.containsKey(end.getClass_()))
         && EcoreUtil.isAncestor(copier.getElementsToCopy(), element);

      return isSelected || hasAllMembers;

   }

}

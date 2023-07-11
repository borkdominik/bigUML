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
package com.eclipsesource.uml.modelserver.core.commands.copy_paste;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.features.copy_paste.ClassCopyBehaviorInfluencer;

public class UmlPasteCompoundCommand extends CompoundCommand {
   protected final SemanticElementAccessor semanticElementAccessor;
   protected final NotationElementAccessor notationElementAccessor;
   protected final Set<CopyBehaviorInfluencer> copyBehaviorInfluencer = Set.of(new ClassCopyBehaviorInfluencer());

   public UmlPasteCompoundCommand(final ModelContext context, final List<String> semanticElementIds) {
      this.semanticElementAccessor = new SemanticElementAccessor(context);
      this.notationElementAccessor = new NotationElementAccessor(context);

      var filteredIds = filterElements(semanticElementIds);
      var elements = filteredIds.stream().map(id -> semanticElementAccessor.getElement(id, Element.class).get())
         .collect(Collectors.toList());

      copyElements(context, elements).forEach(this::append);
   }

   protected List<String> filterElements(final List<String> elementIds) {
      var elements = semanticElementAccessor.getElements(elementIds, Element.class);
      var filtered = EcoreUtil.filterDescendants(elements);
      return filtered.stream().map(f -> SemanticElementAccessor.getId(f)).collect(Collectors.toList());
   }

   protected List<Command> copyElements(final ModelContext context, final List<Element> elements) {
      var commands = new ArrayList<Command>();
      var copied = copyAll(context, elements);

      for (int i = 0; i < copied.size(); i++) {
         var semantic = elements.get(i);
         var semanticCopy = copied.get(i);

         commands.add(
            new UmlPasteSemanticElementCommand(context, semantic, semanticCopy));

         notationElementAccessor.getElement(semantic).ifPresent(notation -> {
            var notationCopy = copy(notation);

            commands.add(
               new UmlPasteNotationElementCommand(context, () -> semanticCopy, notationCopy));
         });

         var originalTree = semantic.eAllContents();
         var copyTree = semanticCopy.eAllContents();

         while (originalTree.hasNext() && copyTree.hasNext()) {
            var originalTreeItem = originalTree.next();
            var copyTreeItem = copyTree.next();

            var childId = SemanticElementAccessor.getUnsafeId(originalTreeItem);

            notationElementAccessor.getElement(childId).ifPresent(childNotation -> {
               var childNotationCopy = copy(childNotation);
               commands.add(
                  new UmlPasteNotationElementCommand(context, () -> copyTreeItem, childNotationCopy));
            });
         }
      }

      return commands;
   }

   protected <T extends EObject> List<T> copyAll(final ModelContext context, final List<T> elements) {
      var copier = new UmlCopier();
      var result = copier.copyAll(elements, copyBehaviorInfluencer);

      copier.copyReferences();
      copyBehaviorInfluencer.forEach(i -> i.modifyReferences(context, elements, copier).forEach(this::append));

      return new ArrayList<>(result);
   }

   protected <T extends EObject> T copy(final T element) {
      var copier = new UmlCopier();
      var result = copier.copy(element);
      copier.copyReferences();

      return (T) result;
   }
}

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
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.features.copy_paste.ClassCopyBehavior;
import com.eclipsesource.uml.modelserver.uml.features.copy_paste.NotMarkedEdgesCopyBehavior;

public class UmlPasteCompoundCommand extends CompoundCommand {
   protected final SemanticElementAccessor semanticElementAccessor;
   protected final NotationElementAccessor notationElementAccessor;
   protected final Set<CopyBehavior> copyBehaviors;

   public UmlPasteCompoundCommand(final ModelContext context, final List<String> semanticElementIds) {
      this.semanticElementAccessor = new SemanticElementAccessor(context);
      this.notationElementAccessor = new NotationElementAccessor(context);
      this.copyBehaviors = Set.of(new NotMarkedEdgesCopyBehavior(context), new ClassCopyBehavior(context));

      var selectedElements = semanticElementAccessor.getElements(semanticElementIds, Element.class);
      var filteredElements = filterElements(selectedElements);

      copyElements(context, filteredElements, selectedElements).forEach(this::append);
   }

   protected List<Element> filterElements(final List<Element> elements) {
      return EcoreUtil.filterDescendants(elements).stream().map(e -> (Element) e).collect(Collectors.toList());
   }

   protected List<Command> copyElements(final ModelContext context, final List<Element> elementsToCopy,
      final List<Element> selectedElements) {
      var commands = new ArrayList<Command>();
      var copier = new UmlCopier(context, copyBehaviors, elementsToCopy, selectedElements);
      var copied = new ArrayList<>(copier.copyAll(elementsToCopy));

      copier.analyzeSuspended();
      copier.copyReferences((behaviors) -> behaviors
         .forEach(i -> i.modifyReferences(copier).forEach(this::append)));

      for (int i = 0; i < copied.size(); i++) {
         var semantic = elementsToCopy.get(i);
         var semanticCopy = copied.get(i);

         commands.add(
            new UmlPasteSemanticElementCommand(context, semantic, semanticCopy));

         notationElementAccessor.getElement(semantic).ifPresent(notation -> {
            var notationCopy = copy(context, notation);

            commands.add(
               new UmlPasteNotationElementCommand(context, () -> semanticCopy, notationCopy));
         });

         var originalTree = semantic.eAllContents();

         while (originalTree.hasNext()) {
            var originalTreeItem = originalTree.next();
            if (!copier.containsKey(originalTreeItem)) {
               continue;
            }

            notationElementAccessor.getElement(originalTreeItem).ifPresent(childNotation -> {
               var childSemanticCopy = copier.get(originalTreeItem);
               var childNotationCopy = copy(context, childNotation);

               commands.add(
                  new UmlPasteNotationElementCommand(context, () -> childSemanticCopy, childNotationCopy,
                     new UmlPasteNotationElementCommand.Options(false)));
            });
         }
      }

      return commands;
   }

   protected <T extends EObject> T copy(final ModelContext context, final T element) {
      var copier = new UmlCopier(context);
      var result = copier.copy(element);
      copier.copyReferences();

      return (T) result;
   }
}

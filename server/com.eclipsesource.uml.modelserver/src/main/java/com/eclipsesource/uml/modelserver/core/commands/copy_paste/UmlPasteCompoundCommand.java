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
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.ecore.util.EcoreUtil.Copier;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class UmlPasteCompoundCommand extends CompoundCommand {
   protected final SemanticElementAccessor semanticElementAccessor;
   protected final NotationElementAccessor notationElementAccessor;

   public UmlPasteCompoundCommand(final ModelContext context, final List<String> semanticElementIds) {
      this.semanticElementAccessor = new SemanticElementAccessor(context);
      this.notationElementAccessor = new NotationElementAccessor(context);

      filterElements(semanticElementIds).forEach(id -> {
         copyElement(context, id).forEach(this::append);
      });
   }

   protected List<String> filterElements(final List<String> elementIds) {
      var elements = semanticElementAccessor.getElements(elementIds, Element.class);
      var filtered = EcoreUtil.filterDescendants(elements);
      return filtered.stream().map(f -> SemanticElementAccessor.getId(f)).collect(Collectors.toList());
   }

   protected List<Command> copyElement(final ModelContext context, final String id) {
      var commands = new ArrayList<Command>();

      var semantic = semanticElementAccessor.getElement(id, Element.class).get();
      var semanticCopy = copy(semantic);
      commands.add(
         new UmlPasteSemanticElementCommand(context, semantic, semanticCopy));

      notationElementAccessor.getElement(id).ifPresent(notation -> {
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

      return commands;
   }

   protected <T extends EObject> T copy(final T originalElem) {
      var copier = new Copier();
      var result = copier.copy(originalElem);
      copier.copyReferences();

      return (T) result;
   }
}

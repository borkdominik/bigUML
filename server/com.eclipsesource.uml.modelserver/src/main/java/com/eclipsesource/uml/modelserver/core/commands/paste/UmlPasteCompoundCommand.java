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
package com.eclipsesource.uml.modelserver.core.commands.paste;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil.Copier;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class UmlPasteCompoundCommand extends CompoundCommand {
   protected final SemanticElementAccessor semanticElementAccessor;
   protected final NotationElementAccessor notationElementAccessor;

   public UmlPasteCompoundCommand(final ModelContext context, final String semanticElementId) {
      this.semanticElementAccessor = new SemanticElementAccessor(context);
      this.notationElementAccessor = new NotationElementAccessor(context);

      var originalSemanticElem = semanticElementAccessor.getElement(semanticElementId).get();
      var copySematicElem = copyElemFromOriginal(originalSemanticElem);
      this.append(new UmlPasteSemanticElementCommand(context, (Element) originalSemanticElem,
         (Element) copySematicElem));

      var originalNotationElem = notationElementAccessor.getElement(semanticElementId).get();
      var copyNotationElem = copyElemFromOriginal(originalNotationElem);

      this.append(
         new UmlPasteNotationElementCommand(context, () -> copySematicElem, (NotationElement) copyNotationElem));
   }

   private EObject copyElemFromOriginal(final EObject originalElem) {
      var copier = new Copier();
      var result = copier.copy(originalElem);
      copier.copyReferences();

      return result;
   }
}

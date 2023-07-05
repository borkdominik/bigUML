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

import java.util.function.Supplier;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;
import org.eclipse.glsp.server.emf.model.notation.NotationFactory;
import org.eclipse.glsp.server.emf.model.notation.Shape;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;

public class UmlPasteNotationElementCommand extends BaseNotationElementCommand {

   private static final int DEFAULT_POSITION_SHIFT = 30;

   protected final NotationElement newNotationElement;
   protected final Supplier<? extends EObject> semanticElementSupplier;

   public UmlPasteNotationElementCommand(final ModelContext context,
      final Supplier<? extends EObject> semanticElementSupplier, final NotationElement newNotationElement) {
      super(context);

      this.newNotationElement = newNotationElement;
      this.semanticElementSupplier = semanticElementSupplier;
   }

   @Override
   protected void doExecute() {
      var semanticReference = NotationFactory.eINSTANCE.createSemanticElementReference();
      semanticReference.setElementId(SemanticElementAccessor.getId(semanticElementSupplier.get()));

      newNotationElement.setSemanticElement(semanticReference);

      if (newNotationElement instanceof Shape) {
         var newPosition = ((Shape) newNotationElement).getPosition();
         newPosition.setX(newPosition.getX() + DEFAULT_POSITION_SHIFT);
         newPosition.setY(newPosition.getY() + DEFAULT_POSITION_SHIFT);
         ((Shape) newNotationElement).setPosition(newPosition);
      }

      diagram.getElements().add(newNotationElement);
   }
}

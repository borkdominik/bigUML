/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.shared.notation.commands;

import java.util.function.Supplier;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.NotationFactory;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;

public class AddShapeNotationCommand extends BaseNotationElementCommand {

   protected final GPoint shapePosition;
   protected final GDimension shapeSize;
   protected final Supplier<? extends EObject> semanticElementSupplier;
   protected final Supplier<String> idSupplier;

   public AddShapeNotationCommand(final ModelContext context, final Supplier<? extends EObject> semanticElementSupplier,
      final GPoint position, final GDimension size) {
      super(context);
      this.semanticElementSupplier = semanticElementSupplier;
      this.idSupplier = null;
      this.shapePosition = position;
      this.shapeSize = size;
   }

   public AddShapeNotationCommand(final ModelContext context, final Supplier<? extends EObject> semanticElementSupplier,
      final Supplier<String> idSupplier,
      final GPoint position, final GDimension size) {
      super(context);
      this.semanticElementSupplier = semanticElementSupplier;
      this.shapePosition = position;
      this.shapeSize = size;
      this.idSupplier = idSupplier;
   }

   @Override
   protected void doExecute() {
      var newShape = NotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      if (this.shapeSize != null) {
         newShape.setSize(shapeSize);
      }

      var semanticReference = NotationFactory.eINSTANCE.createSemanticElementReference();
      if (idSupplier != null) {
         semanticReference.setElementId(idSupplier.get());
      } else {
         semanticReference.setElementId(SemanticElementAccessor.getId(semanticElementSupplier.get()));
      }
      newShape.setSemanticElement(semanticReference);

      diagram.getElements().add(newShape);
   }

}

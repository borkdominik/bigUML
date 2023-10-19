/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.commands.change_bounds;

import java.util.Optional;

import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;

public class UmlChangeBoundsNotationCommand extends BaseNotationElementCommand {
   protected final Optional<GPoint> shapePosition;
   protected final Optional<GDimension> shapeSize;
   protected final Shape shape;
   protected final Element element;
   protected final Optional<String> notationElement;

   public UmlChangeBoundsNotationCommand(final ModelContext context,
      final Element semanticElement, final Optional<GPoint> shapePosition,
      final Optional<GDimension> shapeSize) {
      super(context);
      this.shapePosition = shapePosition;
      this.shapeSize = shapeSize;

      this.element = semanticElement;
      this.notationElement = null;
      this.shape = notationElementAccessor.getElement(semanticId(), Shape.class).get();
   }

   public UmlChangeBoundsNotationCommand(final ModelContext context,
      final Optional<String> notationElement, final Optional<GPoint> shapePosition,
      final Optional<GDimension> shapeSize) {
      super(context);
      this.shapePosition = shapePosition;
      this.shapeSize = shapeSize;

      this.element = null;
      this.notationElement = notationElement;
      this.shape = notationElementAccessor.getElement(notationElement.get(), Shape.class).get();
   }

   /*-
    * Copy is necessary because otherwise we would work on the same instance everywhere
    */
   @Override
   protected void doExecute() {
      this.shapePosition.map(GraphUtil::copy).ifPresent(shape::setPosition);
      this.shapeSize.map(GraphUtil::copy).ifPresent(shape::setSize);
   }

   protected String semanticId() {
      if (SemanticElementAccessor.getId(element) != null) {
         return SemanticElementAccessor.getId(element);
      }
      return notationElement.get();
   }
}

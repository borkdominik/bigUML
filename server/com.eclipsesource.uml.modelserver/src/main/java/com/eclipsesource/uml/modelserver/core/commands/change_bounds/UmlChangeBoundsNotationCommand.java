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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.notation.UmlNotationElementCommand;

public class UmlChangeBoundsNotationCommand extends UmlNotationElementCommand {
   protected final Optional<GPoint> shapePosition;
   protected final Optional<GDimension> shapeSize;
   protected final Shape shape;
   protected final Element element;

   public UmlChangeBoundsNotationCommand(final EditingDomain domain, final URI modelUri,
      final Element semanticElement, final Optional<GPoint> shapePosition,
      final Optional<GDimension> shapeSize) {
      super(domain, modelUri);
      this.shapePosition = shapePosition;
      this.shapeSize = shapeSize;

      this.element = semanticElement;
      this.shape = notationElementAccessor.getElement(semanticId(), Shape.class).get();
   }

   @Override
   protected void doExecute() {
      this.shapePosition.map(GraphUtil::copy).ifPresent(shape::setPosition);
      this.shapeSize.map(GraphUtil::copy).ifPresent(shape::setSize);
   }

   protected String semanticId() {
      return SemanticElementAccessor.getId(element);
   }
}

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
package com.eclipsesource.uml.modelserver.core.commands.change_bounds;

import java.util.Optional;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Shape;

import com.eclipsesource.uml.modelserver.shared.notation.UmlNotationElementCommand;

public class UmlChangeBoundsCommand extends UmlNotationElementCommand {

   protected final Optional<GPoint> shapePosition;
   protected final Optional<GDimension> shapeSize;
   protected final Shape shape;

   public UmlChangeBoundsCommand(final EditingDomain domain, final URI modelUri,
      final String semanticElementId, final Optional<GPoint> shapePosition, final Optional<GDimension> shapeSize) {
      super(domain, modelUri);
      this.shapePosition = shapePosition;
      this.shapeSize = shapeSize;

      this.shape = notationElementAccessor.getElement(semanticElementId, Shape.class);
   }

   public UmlChangeBoundsCommand(final EditingDomain domain, final URI modelUri, final String semanticElementId,
      final GPoint shapePosition) {
      this(domain, modelUri, semanticElementId, Optional.of(shapePosition), Optional.empty());
   }

   public UmlChangeBoundsCommand(final EditingDomain domain, final URI modelUri, final String semanticElementId,
      final GDimension shapeSize) {
      this(domain, modelUri, semanticElementId, Optional.empty(), Optional.of(shapeSize));
   }

   @Override
   protected void doExecute() {
      this.shapePosition.ifPresent(position -> {
         shape.setPosition(position);
      });

      this.shapeSize.ifPresent(size -> {
         shape.setSize(size);
      });
   }

}

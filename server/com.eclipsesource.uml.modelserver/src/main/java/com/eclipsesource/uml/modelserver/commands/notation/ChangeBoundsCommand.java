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
package com.eclipsesource.uml.modelserver.commands.notation;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;

public class ChangeBoundsCommand extends UmlNotationElementCommand {

   protected final GPoint shapePosition;
   protected final GDimension shapeSize;
   protected final Shape shape;

   public ChangeBoundsCommand(final EditingDomain domain, final URI modelUri,
      final String semanticProxyUri, final GPoint shapePosition, final GDimension shapeSize) {
      super(domain, modelUri);
      this.shapePosition = shapePosition;
      this.shapeSize = shapeSize;
      this.shape = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Shape.class);
   }

   @Override
   protected void doExecute() {
      shape.setPosition(shapePosition);
      shape.setSize(shapeSize);
   }

}

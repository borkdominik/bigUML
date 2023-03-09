/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.old.diagram.object_diagram.gmodel;

public abstract class ObjectDiagramFactory { /*-

   public final ObjectDiagramLabelFactory labelFactory;
   public final CommentFactory commentFactory;
   public final CompartmentLabelFactory compartmentLabelFactory;

   public final ObjectDiagramNodeFactory objectDiagramNodeFactory;
   public final ObjectDiagramEdgeFactory objectDiagramEdgeFactory;

   public ObjectDiagramFactory(final UmlModelState modelState) {
      super(modelState);
      // COMMONS
      labelFactory = new ObjectDiagramLabelFactory(modelState);
      commentFactory = new CommentFactory(modelState);
      compartmentLabelFactory = new CompartmentLabelFactory(modelState);
      // OBJECT
      objectDiagramNodeFactory = new ObjectDiagramNodeFactory(modelState, labelFactory);
      objectDiagramEdgeFactory = new ObjectDiagramEdgeFactory(modelState);
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      // no-op as we focus on create(final Diagram umlDiagram)
      return null;
   }
   */
}

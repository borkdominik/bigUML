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
package com.eclipsesource.uml.glsp.uml.usecase_diagram.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.class_diagram.gmodel.CompartmentLabelFactory;
import com.eclipsesource.uml.glsp.uml.common_diagram.gmodel.CommentFactory;

public abstract class UseCaseDiagramFactory extends UseCaseAbstractGModelFactory<EObject, GModelElement> {
   public final UseCaseDiagramLabelFactory labelFactory;
   public final CommentFactory commentFactory;
   public final CompartmentLabelFactory compartmentLabelFactory;

   public final UseCaseDiagramNodeFactory useCaseNodeFactory;
   public final UseCaseDiagramEdgeFactory useCaseEdgeFactory;

   public UseCaseDiagramFactory(final UmlModelState modelState) {
      super(modelState);
      // COMMONS
      labelFactory = new UseCaseDiagramLabelFactory(modelState);
      commentFactory = new CommentFactory(modelState);
      compartmentLabelFactory = new CompartmentLabelFactory(modelState);

      useCaseNodeFactory = new UseCaseDiagramNodeFactory(modelState, labelFactory);
      useCaseEdgeFactory = new UseCaseDiagramEdgeFactory(modelState);
      // useCaseDiagramChildNodeFactory = new
      // UseCaseDiagramChildNodeFactory(modelState, labelFactory, this);
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      // no-op as we focus on create(final Diagram umlDiagram)
      return null;
   }
}

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
package com.eclipsesource.uml.glsp.uml.deployment_diagram.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.class_diagram.gmodel.CompartmentLabelFactory;
import com.eclipsesource.uml.glsp.uml.common_diagram.gmodel.CommentFactory;

public abstract class DeploymentDiagramFactory extends DeploymentAbstractGModelFactory<EObject, GModelElement> {

   public final CommentFactory commentFactory;
   public final CompartmentLabelFactory compartmentLabelFactory;

   public final DeploymentDiagramNodeFactory deploymentNodeFactory;
   public final DeploymentDiagramChildNodeFactory deploymentChildNodeFactory;
   public final DeploymentDiagramEdgeFactory deploymentEdgeFactory;

   public DeploymentDiagramFactory(final UmlModelState modelState) {
      super(modelState);
      // COMMONS
      commentFactory = new CommentFactory(modelState);
      compartmentLabelFactory = new CompartmentLabelFactory(modelState);
      // DEPLOYMENT
      deploymentNodeFactory = new DeploymentDiagramNodeFactory(modelState, this);
      deploymentChildNodeFactory = new DeploymentDiagramChildNodeFactory(modelState);
      deploymentEdgeFactory = new DeploymentDiagramEdgeFactory(modelState);
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      // no-op as we focus on create(final Diagram umlDiagram)
      return null;
   }
}

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
package com.eclipsesource.uml.glsp.old.diagram.deployment_diagram.gmodel;

public abstract class DeploymentDiagramFactory { /*-

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
   */
}

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
package com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.class_diagram.gmodel.CompartmentLabelFactory;
import com.eclipsesource.uml.glsp.uml.common_diagram.gmodel.CommentFactory;

public abstract class StateMachineDiagramFactory extends StateMachineAbstractGModelFactory<EObject, GModelElement> {

   public final StateMachineDiagramLabelFactory labelFactory;
   public final CommentFactory commentFactory;
   public final CompartmentLabelFactory compartmentLabelFactory;

   public final StateMachineDiagramNodeFactory stateMachineNodeFactory;
   public final StateMachineDiagramVertexFactory stateMachineDiagramVertexFactory;
   public final StateMachineDiagramEdgeFactory stateMachineEdgeFactory;
   public final RegionCompartmentFactory regionCompartmentFactory;
   public final StateMachineDiagramPortFactory stateMachinePortFactory;

   public StateMachineDiagramFactory(final UmlModelState modelState) {
      super(modelState);
      // COMMONS
      labelFactory = new StateMachineDiagramLabelFactory(modelState);
      commentFactory = new CommentFactory(modelState);
      compartmentLabelFactory = new CompartmentLabelFactory(modelState);
      // STATEMACHINE
      stateMachineNodeFactory = new StateMachineDiagramNodeFactory(modelState, labelFactory, this);
      stateMachineDiagramVertexFactory = new StateMachineDiagramVertexFactory(modelState, stateMachineNodeFactory);
      stateMachineEdgeFactory = new StateMachineDiagramEdgeFactory(modelState);
      regionCompartmentFactory = new RegionCompartmentFactory(modelState, this);
      stateMachinePortFactory = new StateMachineDiagramPortFactory(modelState);
   }

   @Override
   public GModelElement create(final EObject semanticElement) {
      // no-op as we focus on create(final Diagram umlDiagram)
      return null;
   }
}

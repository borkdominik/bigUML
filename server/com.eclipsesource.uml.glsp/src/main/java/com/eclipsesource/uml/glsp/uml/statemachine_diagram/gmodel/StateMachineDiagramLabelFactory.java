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
package com.eclipsesource.uml.glsp.uml.statemachine_diagram.gmodel;

import org.eclipse.glsp.graph.GLabel;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.model.UmlModelState;

public class StateMachineDiagramLabelFactory extends StateMachineAbstractGModelFactory<NamedElement, GLabel> {

   public StateMachineDiagramLabelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GLabel create(final NamedElement namedElement) {
      return null;
   }

}

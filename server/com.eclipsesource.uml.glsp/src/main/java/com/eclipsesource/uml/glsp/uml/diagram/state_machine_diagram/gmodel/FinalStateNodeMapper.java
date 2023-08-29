/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.uml2.uml.FinalState;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_FinalState;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class FinalStateNodeMapper extends BaseGNodeMapper<FinalState, GNode>
   implements NamedElementGBuilder<FinalState> {

   @Override
   public GNode map(final FinalState source) {
      var builder = new GNodeBuilder(UmlStateMachine_FinalState.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.NO_STROKE);

      applyShapeNotation(source, builder);

      return builder.build();
   }
}

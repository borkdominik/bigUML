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
package com.eclipsesource.uml.glsp.layout;

import org.eclipse.elk.alg.layered.options.EdgeLabelSideSelection;
import org.eclipse.elk.alg.layered.options.LayeredOptions;
import org.eclipse.elk.core.options.EdgeLabelPlacement;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.layout.ElkLayoutEngine;
import org.eclipse.glsp.layout.GLSPLayoutConfigurator;
import org.eclipse.glsp.server.model.GModelState;

public class UmlLayoutEngine extends ElkLayoutEngine {

   public GModelElement layoutRoot(final GModelState modelState) {

      GModelElement newRoot = EcoreUtil.copy(modelState.getRoot());
      if (newRoot instanceof GGraph) {
         GLSPLayoutConfigurator configurator = new GLSPLayoutConfigurator();
         // ELK Layered Algorithm Reference:
         // https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-layered.html
         configurator.configureByType(DefaultTypes.GRAPH)
            .setProperty(LayeredOptions.EDGE_LABELS_PLACEMENT, EdgeLabelPlacement.CENTER)
            .setProperty(LayeredOptions.EDGE_LABELS_SIDE_SELECTION, EdgeLabelSideSelection.ALWAYS_UP);
         this.layout((GGraph) newRoot, configurator);
      }
      return newRoot;
   }

}

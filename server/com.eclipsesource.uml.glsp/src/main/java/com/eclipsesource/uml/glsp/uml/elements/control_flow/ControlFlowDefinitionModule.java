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
package com.eclipsesource.uml.glsp.uml.elements.control_flow;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.uml.elements.control_flow.gmodel.suffix.GuardLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.control_flow.gmodel.suffix.WeightLabelSuffix;
import com.eclipsesource.uml.glsp.uml.manifest.edge.EdgeFactoryDefinition;

public class ControlFlowDefinitionModule extends EdgeFactoryDefinition implements SuffixIdAppenderContribution {

   public ControlFlowDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation(), ControlFlowFactory.class);
   }

   @Override
   protected void configure() {
      super.configure();

      contributeSuffixIdAppenders((contribution) -> {
         contribution.addBinding(GuardLabelSuffix.SUFFIX).to(GuardLabelSuffix.class);
         contribution.addBinding(WeightLabelSuffix.SUFFIX).to(WeightLabelSuffix.class);
      });
   }
}

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
package com.eclipsesource.uml.glsp.core.gmodel.builder;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.provider.IdContextGeneratorGProvider;

public interface DividerGBuilder extends IdContextGeneratorGProvider {
   default GModelElement buildDivider(final EObject source, final String subtitle) {
      var options = new GLayoutOptions();
      options.put("hGrab", true);
      return new GNodeBuilder(CoreTypes.DIVIDER)
         .id(idContextGenerator().getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(options)
         .add(new GLabelBuilder()
            .id(idContextGenerator().getOrCreateId(source))
            .text(subtitle)
            .addCssClass(CoreCSS.DIVIDER_SUBTITLE)
            .build())
         .build();
   }
}

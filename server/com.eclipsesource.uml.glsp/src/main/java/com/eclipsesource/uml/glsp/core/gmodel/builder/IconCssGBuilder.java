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
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.provider.IdContextGeneratorGProvider;

public interface IconCssGBuilder extends IdContextGeneratorGProvider {

   default GLabelBuilder iconFromCssPropertyBuilder(final EObject source, final String cssProperty) {
      return new GLabelBuilder(CoreTypes.ICON_CSS)
         .id(idContextGenerator().getOrCreateId(source))
         .addArgument("property", cssProperty);
   }
}

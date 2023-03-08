/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.diagram;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.glsp.server.types.ShapeTypeHint;

public interface DiagramElementConfiguration {

   Map<String, EClass> getTypeMappings();

   interface Node extends DiagramElementConfiguration {
      Set<String> getGraphContainableElements();

      Set<ShapeTypeHint> getShapeTypeHints();
   }

   interface Edge extends DiagramElementConfiguration {
      Set<EdgeTypeHint> getEdgeTypeHints();
   }
}

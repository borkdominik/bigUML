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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.diagram;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.glsp.server.types.ShapeTypeHint;

import com.eclipsesource.uml.glsp.core.diagram.DiagramConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.google.common.collect.Lists;

public class CommunicationConfiguration implements DiagramConfiguration {

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         new EdgeTypeHint(CommunicationTypes.MESSAGE, true, true, true, List.of(CommunicationTypes.LIFELINE),
            List.of(CommunicationTypes.LIFELINE)));
   }

   @Override
   public List<String> getGraphContainableElements() { return List.of(CommunicationTypes.INTERACTION); }

   @Override
   public List<ShapeTypeHint> getShapeTypeHints() {
      List<ShapeTypeHint> hints = new ArrayList<>();

      hints.add(new ShapeTypeHint(CommunicationTypes.INTERACTION, true, true, true, false,
         List.of(CommunicationTypes.LIFELINE)));
      hints.add(new ShapeTypeHint(CommunicationTypes.LIFELINE, true, true, false, false));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      mappings.put(CommunicationTypes.INTERACTION, GraphPackage.Literals.GNODE);
      mappings.put(CommunicationTypes.ICON_INTERACTION, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(CommunicationTypes.LIFELINE, GraphPackage.Literals.GNODE);
      mappings.put(CommunicationTypes.ICON_LIFELINE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(CommunicationTypes.MESSAGE, GraphPackage.Literals.GEDGE);
      mappings.put(CommunicationTypes.MESSAGE_LABEL_ARROW_EDGE_NAME, GraphPackage.Literals.GLABEL);

      return mappings;
   }
}

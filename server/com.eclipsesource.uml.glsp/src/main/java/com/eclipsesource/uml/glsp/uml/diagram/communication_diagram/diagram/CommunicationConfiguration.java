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
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Interaction;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Lifeline;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Message;
import com.google.common.collect.Lists;

public class CommunicationConfiguration implements DiagramConfiguration {

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         new EdgeTypeHint(UmlCommunication_Message.TYPE_ID, true, true, true,
            List.of(UmlCommunication_Lifeline.TYPE_ID),
            List.of(UmlCommunication_Lifeline.TYPE_ID)));
   }

   @Override
   public List<String> getGraphContainableElements() { return List.of(UmlCommunication_Interaction.TYPE_ID); }

   @Override
   public List<ShapeTypeHint> getShapeTypeHints() {
      List<ShapeTypeHint> hints = new ArrayList<>();

      hints.add(new ShapeTypeHint(UmlCommunication_Interaction.TYPE_ID, true, true, true, false,
         List.of(UmlCommunication_Lifeline.TYPE_ID)));
      hints.add(new ShapeTypeHint(UmlCommunication_Lifeline.TYPE_ID, true, true, false, false));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      mappings.put(UmlCommunication_Interaction.TYPE_ID, GraphPackage.Literals.GNODE);
      mappings.put(UmlCommunication_Interaction.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlCommunication_Lifeline.TYPE_ID, GraphPackage.Literals.GNODE);
      mappings.put(UmlCommunication_Lifeline.ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(UmlCommunication_Message.TYPE_ID, GraphPackage.Literals.GEDGE);

      return mappings;
   }
}

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
package com.eclipsesource.uml.glsp.uml.activity_diagram;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.diagram.BaseDiagramConfiguration;
import org.eclipse.glsp.server.layout.ServerLayoutKind;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.glsp.server.types.ShapeTypeHint;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class ActivityDiagramConfiguration extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // COMMONS
         createDefaultEdgeTypeHint(Types.COMMENT_EDGE),
         // ACTIVITY DIAGRAM
         createDefaultEdgeTypeHint(Types.CONTROLFLOW),
         createDefaultEdgeTypeHint(Types.EXCEPTIONHANDLER));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;
      List<String> from = new ArrayList<>();
      List<String> to = new ArrayList<>();

      switch (elementId) {
         // ACTIVITY DIAGRAM
         case Types.CONTROLFLOW:
            from.addAll(Types.ACTIONS);
            from.addAll(Types.CONTROL_NODES);
            from.add(Types.PARAMETER);
            from.add(Types.PIN_PORT);
            from.add(Types.CENTRALBUFFER);
            from.add(Types.DATASTORE);
            from.remove(Types.FINALNODE);
            from.remove(Types.FLOWFINALNODE);

            to.addAll(Types.ACTIONS);
            to.addAll(Types.CONTROL_NODES);
            to.add(Types.PARAMETER);
            to.add(Types.PIN_PORT);
            to.add(Types.CENTRALBUFFER);
            to.add(Types.DATASTORE);
            to.remove(Types.INITIALNODE);
            return new EdgeTypeHint(elementId, true, true, true, from, to);
         case Types.EXCEPTIONHANDLER:
            return new EdgeTypeHint(elementId, false, true, false,
               List.of(Types.ACTION, Types.CALL, Types.ACCEPTEVENT),
               List.of(Types.PIN_PORT));
         default:
            break;
      }
      return new EdgeTypeHint(elementId, true, true, true, List.of(), List.of());
   }

   @Override
   public List<ShapeTypeHint> getShapeTypeHints() {
      List<ShapeTypeHint> hints = new ArrayList<>();
      // GRAPH
      hints.add(new ShapeTypeHint(DefaultTypes.GRAPH, false, false, false, false,
         List.of(Types.COMMENT, Types.CLASS, Types.ACTIVITY, Types.USECASE, Types.ACTOR, Types.PACKAGE, Types.COMPONENT,
            Types.STATE_MACHINE, Types.DEPLOYMENT_NODE, Types.DEVICE, Types.ARTIFACT, Types.ENUMERATION,
            Types.EXECUTION_ENVIRONMENT, Types.OBJECT, Types.DEPLOYMENT_COMPONENT, Types.INTERFACE,
            Types.ABSTRACT_CLASS)));

      // ACTIVITY DIAGRAM
      hints.add(new ShapeTypeHint(Types.ACTIVITY, true, true, true, false,
         List.of(Types.ACTION, Types.ACCEPTEVENT, Types.TIMEEVENT, Types.SENDSIGNAL, Types.CALL, Types.INITIALNODE,
            Types.FINALNODE, Types.FLOWFINALNODE, Types.DECISIONMERGENODE, Types.FORKJOINNODE,
            Types.PARAMETER, Types.CENTRALBUFFER, Types.DATASTORE, Types.PARTITION, Types.CONDITION,
            Types.INTERRUPTIBLEREGION, Types.COMMENT)));

      hints.add(new ShapeTypeHint(Types.PARTITION, true, true, true, false,
         List.of(Types.ACTION, Types.ACCEPTEVENT, Types.TIMEEVENT, Types.SENDSIGNAL, Types.CALL, Types.INITIALNODE,
            Types.FINALNODE, Types.FLOWFINALNODE, Types.DECISIONMERGENODE, Types.FORKJOINNODE,
            Types.PARTITION, Types.INTERRUPTIBLEREGION, Types.COMMENT)));

      hints.add(new ShapeTypeHint(Types.INTERRUPTIBLEREGION, true, true, true, false,
         List.of(Types.ACTION, Types.ACCEPTEVENT, Types.TIMEEVENT, Types.SENDSIGNAL, Types.CALL, Types.INITIALNODE,
            Types.FINALNODE, Types.FLOWFINALNODE, Types.DECISIONMERGENODE, Types.FORKJOINNODE,
            Types.PARTITION, Types.INTERRUPTIBLEREGION, Types.COMMENT)));

      hints.add(new ShapeTypeHint(Types.ACTION, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
      hints.add(new ShapeTypeHint(Types.CALL, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
      hints.add(new ShapeTypeHint(Types.ACCEPTEVENT, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
      hints.add(new ShapeTypeHint(Types.TIMEEVENT, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
      hints.add(new ShapeTypeHint(Types.SENDSIGNAL, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));

      hints.add(new ShapeTypeHint(Types.INITIALNODE, true, true, false, false));
      hints.add(new ShapeTypeHint(Types.FINALNODE, true, true, false, false, List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.FLOWFINALNODE, true, true, false, false, List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.DECISIONMERGENODE, true, true, false, false, List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.FORKJOINNODE, true, true, false, false, List.of(Types.COMMENT)));

      hints.add(new ShapeTypeHint(Types.PARAMETER, true, true, false, false, List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.PIN, true, true, false, false, List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.CENTRALBUFFER, true, true, false, false, List.of(Types.COMMENT)));
      hints.add(new ShapeTypeHint(Types.DATASTORE, true, true, false, false, List.of(Types.COMMENT)));

      hints.add(new ShapeTypeHint(Types.CONDITION, true, true, false, false));

      // Comment
      hints.add(new ShapeTypeHint(Types.COMMENT, true, true, false, false));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // COMMONS
      mappings.put(Types.LABEL_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_TEXT, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_EDGE_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(Types.LABEL_EDGE_MULTIPLICITY, GraphPackage.Literals.GLABEL);
      mappings.put(Types.COMP, GraphPackage.Literals.GCOMPARTMENT);
      // mappings.put(Types.COMP_HEADER, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.LABEL_ICON, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.COMMENT, GraphPackage.Literals.GNODE);
      mappings.put(Types.COMMENT_EDGE, GraphPackage.Literals.GEDGE);
      mappings.put(Types.COMPARTMENT, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.COMPARTMENT_HEADER, GraphPackage.Literals.GCOMPARTMENT);

      // ACTIVITY DIAGRAM
      mappings.put(Types.ACTIVITY, GraphPackage.Literals.GNODE);
      mappings.put(Types.ICON_ACTIVITY, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(Types.PARTITION, GraphPackage.Literals.GNODE);
      mappings.put(Types.CONTROLFLOW, GraphPackage.Literals.GEDGE);
      Types.ACTIONS.forEach(a -> mappings.put(a, GraphPackage.Literals.GNODE));
      Types.CONTROL_NODES.forEach(node -> mappings.put(node, GraphPackage.Literals.GNODE));
      // mappings.put(Types.CONDITION, GraphPackage.Literals.GLABEL);
      mappings.put(Types.PARAMETER, GraphPackage.Literals.GNODE);
      mappings.put(Types.PIN, GraphPackage.Literals.GNODE);
      mappings.put(Types.CENTRALBUFFER, GraphPackage.Literals.GNODE);
      mappings.put(Types.DATASTORE, GraphPackage.Literals.GNODE);
      mappings.put(Types.EXCEPTIONHANDLER, GraphPackage.Literals.GEDGE);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}

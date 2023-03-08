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
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram;

public class ActivityDiagramConfiguration { /*-
 extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // ACTIVITY DIAGRAM
         createDefaultEdgeTypeHint(ActivityTypes.CONTROLFLOW),
         createDefaultEdgeTypeHint(ActivityTypes.EXCEPTIONHANDLER));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;
      List<String> from = new ArrayList<>();
      List<String> to = new ArrayList<>();

      switch (elementId) {
         // ACTIVITY DIAGRAM
         case ActivityTypes.CONTROLFLOW:
            from.addAll(ActivityTypes.ACTIONS);
            from.addAll(ActivityTypes.CONTROL_NODES);
            from.add(ActivityTypes.PARAMETER);
            from.add(ActivityTypes.PIN_PORT);
            from.add(ActivityTypes.CENTRALBUFFER);
            from.add(ActivityTypes.DATASTORE);
            from.remove(ActivityTypes.FINALNODE);
            from.remove(ActivityTypes.FLOWFINALNODE);

            to.addAll(ActivityTypes.ACTIONS);
            to.addAll(ActivityTypes.CONTROL_NODES);
            to.add(ActivityTypes.PARAMETER);
            to.add(ActivityTypes.PIN_PORT);
            to.add(ActivityTypes.CENTRALBUFFER);
            to.add(ActivityTypes.DATASTORE);
            to.remove(ActivityTypes.INITIALNODE);
            return new EdgeTypeHint(elementId, true, true, true, from, to);
         case ActivityTypes.EXCEPTIONHANDLER:
            return new EdgeTypeHint(elementId, false, true, false,
               List.of(ActivityTypes.ACTION, ActivityTypes.CALL, ActivityTypes.ACCEPTEVENT),
               List.of(ActivityTypes.PIN_PORT));
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
         List.of(ActivityTypes.ACTIVITY)));

      // ACTIVITY DIAGRAM
      hints.add(new ShapeTypeHint(ActivityTypes.ACTIVITY, true, true, true, false,
         List.of(ActivityTypes.ACTION, ActivityTypes.ACCEPTEVENT, ActivityTypes.TIMEEVENT, ActivityTypes.SENDSIGNAL,
            ActivityTypes.CALL, ActivityTypes.INITIALNODE,
            ActivityTypes.FINALNODE, ActivityTypes.FLOWFINALNODE, ActivityTypes.DECISIONMERGENODE,
            ActivityTypes.FORKJOINNODE,
            ActivityTypes.PARAMETER, ActivityTypes.CENTRALBUFFER, ActivityTypes.DATASTORE, ActivityTypes.PARTITION,
            ActivityTypes.CONDITION,
            ActivityTypes.INTERRUPTIBLEREGION)));

      hints.add(new ShapeTypeHint(ActivityTypes.PARTITION, true, true, true, false,
         List.of(ActivityTypes.ACTION, ActivityTypes.ACCEPTEVENT, ActivityTypes.TIMEEVENT, ActivityTypes.SENDSIGNAL,
            ActivityTypes.CALL, ActivityTypes.INITIALNODE,
            ActivityTypes.FINALNODE, ActivityTypes.FLOWFINALNODE, ActivityTypes.DECISIONMERGENODE,
            ActivityTypes.FORKJOINNODE,
            ActivityTypes.PARTITION, ActivityTypes.INTERRUPTIBLEREGION)));

      hints.add(new ShapeTypeHint(ActivityTypes.INTERRUPTIBLEREGION, true, true, true, false,
         List.of(ActivityTypes.ACTION, ActivityTypes.ACCEPTEVENT, ActivityTypes.TIMEEVENT, ActivityTypes.SENDSIGNAL,
            ActivityTypes.CALL, ActivityTypes.INITIALNODE,
            ActivityTypes.FINALNODE, ActivityTypes.FLOWFINALNODE, ActivityTypes.DECISIONMERGENODE,
            ActivityTypes.FORKJOINNODE,
            ActivityTypes.PARTITION, ActivityTypes.INTERRUPTIBLEREGION)));

      hints.add(new ShapeTypeHint(ActivityTypes.ACTION, true, true, false, false,
         List.of(ActivityTypes.PIN)));
      hints.add(new ShapeTypeHint(ActivityTypes.CALL, true, true, false, false,
         List.of(ActivityTypes.PIN)));
      hints.add(new ShapeTypeHint(ActivityTypes.ACCEPTEVENT, true, true, false, false,
         List.of(ActivityTypes.PIN)));
      hints.add(new ShapeTypeHint(ActivityTypes.TIMEEVENT, true, true, false, false,
         List.of(ActivityTypes.PIN)));
      hints.add(new ShapeTypeHint(ActivityTypes.SENDSIGNAL, true, true, false, false,
         List.of(ActivityTypes.PIN)));

      hints.add(new ShapeTypeHint(ActivityTypes.INITIALNODE, true, true, false, false));
      hints.add(new ShapeTypeHint(ActivityTypes.FINALNODE, true, true, false, false, List.of()));
      hints
         .add(new ShapeTypeHint(ActivityTypes.FLOWFINALNODE, true, true, false, false, List.of()));
      hints.add(
         new ShapeTypeHint(ActivityTypes.DECISIONMERGENODE, true, true, false, false, List.of()));
      hints
         .add(new ShapeTypeHint(ActivityTypes.FORKJOINNODE, true, true, false, false, List.of()));

      hints.add(new ShapeTypeHint(ActivityTypes.PARAMETER, true, true, false, false, List.of()));
      hints.add(new ShapeTypeHint(ActivityTypes.PIN, true, true, false, false, List.of()));
      hints
         .add(new ShapeTypeHint(ActivityTypes.CENTRALBUFFER, true, true, false, false, List.of()));
      hints.add(new ShapeTypeHint(ActivityTypes.DATASTORE, true, true, false, false, List.of()));

      hints.add(new ShapeTypeHint(ActivityTypes.CONDITION, true, true, false, false));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // ACTIVITY DIAGRAM
      mappings.put(ActivityTypes.ACTIVITY, GraphPackage.Literals.GNODE);
      mappings.put(ActivityTypes.ICON_ACTIVITY, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(ActivityTypes.PARTITION, GraphPackage.Literals.GNODE);
      mappings.put(ActivityTypes.CONTROLFLOW, GraphPackage.Literals.GEDGE);
      ActivityTypes.ACTIONS.forEach(a -> mappings.put(a, GraphPackage.Literals.GNODE));
      ActivityTypes.CONTROL_NODES.forEach(node -> mappings.put(node, GraphPackage.Literals.GNODE));
      // mappings.put(ActivityTypes.CONDITION, GraphPackage.Literals.GLABEL);
      mappings.put(ActivityTypes.PARAMETER, GraphPackage.Literals.GNODE);
      mappings.put(ActivityTypes.PIN, GraphPackage.Literals.GNODE);
      mappings.put(ActivityTypes.CENTRALBUFFER, GraphPackage.Literals.GNODE);
      mappings.put(ActivityTypes.DATASTORE, GraphPackage.Literals.GNODE);
      mappings.put(ActivityTypes.EXCEPTIONHANDLER, GraphPackage.Literals.GEDGE);
      // COMMON CANDIDATE
      mappings.put(UseCaseTypes.STRUCTURE, GraphPackage.Literals.GCOMPARTMENT);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }
   */
}

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
package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram;

public class StateMachineDiagramConfiguration { /*-
 extends BaseDiagramConfiguration {

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   public List<EdgeTypeHint> getEdgeTypeHints() {
      return Lists.newArrayList(
         // STATE MACHINE DIAGRAM
         createDefaultEdgeTypeHint(StateMachineTypes.TRANSITION));
   }

   @Override
   public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
      List<String> allowed;

      ArrayList<String> from;
      ArrayList<String> to;

      switch (elementId) {
         // STATE MACHINE DIAGRAM
         case StateMachineTypes.TRANSITION:
            allowed = Lists.newArrayList(StateMachineTypes.STATE, StateMachineTypes.FINAL_STATE);
            allowed.addAll(StateMachineTypes.PSEUDOSTATES);
            return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
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
         List.of(
            StateMachineTypes.STATE_MACHINE)));

      // STATE MACHINE DIAGRAM
      hints.add(new ShapeTypeHint(StateMachineTypes.STATE_MACHINE, true, true, true, false,
         List.of(StateMachineTypes.REGION, StateMachineTypes.STATE, StateMachineTypes.INITIAL_STATE,
            StateMachineTypes.DEEP_HISTORY, StateMachineTypes.SHALLOW_HISTORY, StateMachineTypes.FORK,
            StateMachineTypes.JOIN,
            StateMachineTypes.JUNCTION, StateMachineTypes.CHOICE, StateMachineTypes.ENTRY_POINT,
            StateMachineTypes.EXIT_POINT, StateMachineTypes.TERMINATE, StateMachineTypes.FINAL_STATE)));
      hints.add(new ShapeTypeHint(StateMachineTypes.REGION, true, true, true, true,
         List.of(StateMachineTypes.STATE, StateMachineTypes.INITIAL_STATE, StateMachineTypes.DEEP_HISTORY,
            StateMachineTypes.SHALLOW_HISTORY, StateMachineTypes.FORK, StateMachineTypes.JOIN,
            StateMachineTypes.JUNCTION, StateMachineTypes.CHOICE, StateMachineTypes.ENTRY_POINT,
            StateMachineTypes.EXIT_POINT, StateMachineTypes.TERMINATE, StateMachineTypes.FINAL_STATE)));
      hints.add(new ShapeTypeHint(StateMachineTypes.STATE, true, true, true, false,
         List.of(StateMachineTypes.ENTRY_POINT, StateMachineTypes.EXIT_POINT, StateMachineTypes.STATE_ENTRY_ACTIVITY,
            StateMachineTypes.STATE_DO_ACTIVITY,
            StateMachineTypes.STATE_EXIT_ACTIVITY, StateMachineTypes.REGION)));
      hints.add(new ShapeTypeHint(StateMachineTypes.INITIAL_STATE, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.DEEP_HISTORY, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.SHALLOW_HISTORY, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.FORK, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.JOIN, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.JUNCTION, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.CHOICE, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.STATE_ENTRY_ACTIVITY, false, true, false, true,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.STATE_DO_ACTIVITY, false, true, false, true,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.STATE_EXIT_ACTIVITY, false, true, false, true,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.FINAL_STATE, true, true, true, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.ENTRY_POINT, true, true, false, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.EXIT_POINT, true, true, false, false,
         List.of()));
      hints.add(new ShapeTypeHint(StateMachineTypes.TERMINATE, true, true, true, false,
         List.of()));

      return hints;
   }

   @Override
   public Map<String, EClass> getTypeMappings() {
      Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

      // STATE MACHINE DIAGRAM
      mappings.put(StateMachineTypes.ICON_STATE_MACHINE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(StateMachineTypes.STATE_MACHINE, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.REGION, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.ICON_STATE, GraphPackage.Literals.GCOMPARTMENT);
      mappings.put(StateMachineTypes.STATE, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.LABEL_VERTEX_NAME, GraphPackage.Literals.GLABEL);
      mappings.put(StateMachineTypes.INITIAL_STATE, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.DEEP_HISTORY, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.SHALLOW_HISTORY, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.JOIN, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.FORK, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.JUNCTION, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.CHOICE, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.ENTRY_POINT, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.EXIT_POINT, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.TERMINATE, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.FINAL_STATE, GraphPackage.Literals.GNODE);
      mappings.put(StateMachineTypes.STATE_ENTRY_ACTIVITY, GraphPackage.Literals.GLABEL);
      mappings.put(StateMachineTypes.STATE_DO_ACTIVITY, GraphPackage.Literals.GLABEL);
      mappings.put(StateMachineTypes.STATE_EXIT_ACTIVITY, GraphPackage.Literals.GLABEL);
      mappings.put(StateMachineTypes.TRANSITION, GraphPackage.Literals.GEDGE);
      // COMMON CANDIDATE
      mappings.put(StateMachineTypes.STRUCTURE, GraphPackage.Literals.GCOMPARTMENT);

      return mappings;
   }

   @Override
   public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }
   */
}

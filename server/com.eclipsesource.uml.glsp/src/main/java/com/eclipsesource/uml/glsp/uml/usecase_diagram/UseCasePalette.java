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
package com.eclipsesource.uml.glsp.uml.usecase_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class UseCasePalette {
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersStateMachine(), behaviourStateMachine(),
         relationsStateMachine(), comment());
   }

   private PaletteItem classifiersStateMachine() {
      PaletteItem createStateMachine = node(Types.STATE_MACHINE, "State Machine", "umlstatemachine");
      PaletteItem createRegion = node(Types.REGION, "Region", "umlinterruptibleregion");
      PaletteItem createState = node(Types.STATE, "State", "umlstate");
      PaletteItem createFinalState = node(Types.FINAL_STATE, "Final State", "umlfinalstate");

      // Pseudo States
      PaletteItem createInitialState = node(Types.INITIAL_STATE, "Initial", "umlinitialstate");
      PaletteItem createDeepHistory = node(Types.DEEP_HISTORY, "DeepHistory", "umldeephistory");
      PaletteItem createShallowHistory = node(Types.SHALLOW_HISTORY, "ShallowHistory", "umlshallowhistory");
      PaletteItem createFork = node(Types.FORK, "Fork", "umlfork");
      PaletteItem createJoin = node(Types.JOIN, "Join", "umljoin");
      PaletteItem createJunction = node(Types.JUNCTION, "Junction", "umljunction");
      PaletteItem createChoice = node(Types.CHOICE, "Choice", "umlchoice");
      PaletteItem createEntryPoint = node(Types.ENTRY_POINT, "Entry Point", "umlentrypoint");
      PaletteItem createExitPoint = node(Types.EXIT_POINT, "Exit Point", "umlexitpoint");

      List<PaletteItem> classifiers = Lists.newArrayList(
         createStateMachine, createState, createFinalState, createChoice, createFork, createInitialState,
         createJoin, createJunction, createDeepHistory, createShallowHistory, createEntryPoint, createExitPoint,
         createRegion);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem behaviourStateMachine() {
      PaletteItem createEntryActivity = node(Types.STATE_ENTRY_ACTIVITY, "State Entry Activity",
         "umlstateactivity");
      PaletteItem createDoActivity = node(Types.STATE_DO_ACTIVITY, "State Do Activity",
         "umlstateactivity");
      PaletteItem createExitActivity = node(Types.STATE_EXIT_ACTIVITY, "State Exit Activity",
         "umlstateactivity");

      List<PaletteItem> behaviour = Lists.newArrayList(
         createEntryActivity, createDoActivity, createExitActivity);
      return PaletteItem.createPaletteGroup("uml.feature", "Behaviour", behaviour, "symbol-property");
   }

   private PaletteItem relationsStateMachine() {
      PaletteItem createTransition = edge(Types.TRANSITION, "Transition", "umltransition");

      List<PaletteItem> relations = Lists.newArrayList(createTransition);
      return PaletteItem.createPaletteGroup("uml.relation", "Relations", relations, "symbol-property");
   }

   private PaletteItem comment() {
      PaletteItem createCommentNode = node(Types.COMMENT, "Comment", "umlcomment");
      // PaletteItem createCommentEdge = node(Types.COMMENT_EDGE, "Comment Edge", "umlcommentedge");

      List<PaletteItem> comment = Lists.newArrayList(createCommentNode);
      return PaletteItem.createPaletteGroup("uml.comment", "Comment", comment, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

}

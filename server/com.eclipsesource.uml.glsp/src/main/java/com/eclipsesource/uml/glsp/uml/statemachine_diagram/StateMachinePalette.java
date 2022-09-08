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
package com.eclipsesource.uml.glsp.uml.statemachine_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class StateMachinePalette {
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersUseCase(), relationsUseCase(), comment());
   }

   private PaletteItem classifiersUseCase() {
      PaletteItem createUseCase = node(Types.USECASE, "Use Case", "umlusecase");
      PaletteItem createPackage = node(Types.PACKAGE, "Package", "umlpackage");
      PaletteItem createComponent = node(Types.COMPONENT, "Component", "umlcomponent");
      PaletteItem createActor = node(Types.ACTOR, "Actor", "umlactor");

      List<PaletteItem> classifiers = Lists.newArrayList(createUseCase, createPackage, createComponent, createActor);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsUseCase() {
      PaletteItem createExtend = edge(Types.EXTEND, "Extend", "umlextend");
      PaletteItem createInclude = edge(Types.INCLUDE, "Include", "umlinclude");
      PaletteItem createGeneralization = edge(Types.GENERALIZATION, "Generalization", "umlgeneralization");
      PaletteItem createAssociation = edge(Types.USECASE_ASSOCIATION, "Association", "umlassociation");

      List<PaletteItem> relations = Lists.newArrayList(createExtend, createInclude, createGeneralization,
         createAssociation);
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

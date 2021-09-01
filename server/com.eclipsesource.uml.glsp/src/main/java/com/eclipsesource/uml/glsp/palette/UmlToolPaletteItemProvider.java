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
package com.eclipsesource.uml.glsp.palette;

import java.util.List;
import java.util.Map;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import org.apache.log4j.Logger;
import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.model.GModelState;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class UmlToolPaletteItemProvider implements ToolPaletteItemProvider {

   private static final Logger LOGGER = Logger.getLogger(UmlToolPaletteItemProvider.class.getSimpleName());

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args, final GModelState modelState) {
      Representation diagramType = UmlModelState.getModelState(modelState).getUmlFacade().getDiagram().getDiagramType();

      System.out.println("------- CURRENT DIAGRAM TYPE: " + diagramType + " ----------");

      List<PaletteItem> classDiagram = Lists.newArrayList(classifiers(), relations(), features());
      List<PaletteItem> activityDiagram = Lists.newArrayList(/*activities(), activityFeatures()*/);
      List<PaletteItem> stateMachineDiagram = Lists.newArrayList();
      List<PaletteItem> deploymentDiagram = Lists.newArrayList();
      List<PaletteItem> useCaseDiagram = Lists.newArrayList();

      LOGGER.info("Create palette");
      
      List<PaletteItem> finalPalette = null;

      if (diagramType == Representation.CLASS) {
         finalPalette = classDiagram;
      } else if (diagramType == Representation.ACTIVITY) {
         finalPalette = activityDiagram;
      } else if (diagramType == Representation.DEPLOYMENT) {
         finalPalette = deploymentDiagram;
      } else if (diagramType == Representation.STATEMACHINE) {
         finalPalette = stateMachineDiagram;
      } else if (diagramType == Representation.USECASE) {
         finalPalette = useCaseDiagram;
      }
      return finalPalette;
   }

   private PaletteItem classifiers() {
      PaletteItem createClass = node(Types.CLASS, "Class", "umlclass");

      List<PaletteItem> classifiers = Lists.newArrayList(createClass);
      return PaletteItem.createPaletteGroup("uml.classifier", "Classifier", classifiers, "fa-hammer");
   }

   private PaletteItem relations() {
      PaletteItem createAssociation = edge(Types.ASSOCIATION, "Association", "umlassociation");

      List<PaletteItem> edges = Lists.newArrayList(createAssociation);
      return PaletteItem.createPaletteGroup("uml.relation", "Relation", edges, "fa-hammer");
   }

   private PaletteItem features() {
      PaletteItem createProperty = node(Types.PROPERTY, "Property", "umlproperty");

      List<PaletteItem> features = Lists.newArrayList(createProperty);

      return PaletteItem.createPaletteGroup("uml.feature", "Feature", features, "fa-hammer");
   }

   /*private PaletteItem activities() {
      PaletteItem createActivity = node(Types.ACTIVITY, "Activity", "umlactivity");

      List<PaletteItem> activities = Lists.newArrayList(createActivity);
      return PaletteItem.createPaletteGroup("uml.activities", "Activities", activities, "fa-hammer");
   }

   private PaletteItem activityFeatures() {
      PaletteItem createAction = node(Types.ACTION, "Action", "umlaction");

      List<PaletteItem> features = Lists.newArrayList(createAction);
      return PaletteItem.createPaletteGroup("uml.features", "Features", features, "fa-hammer");
   }*/

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }
}

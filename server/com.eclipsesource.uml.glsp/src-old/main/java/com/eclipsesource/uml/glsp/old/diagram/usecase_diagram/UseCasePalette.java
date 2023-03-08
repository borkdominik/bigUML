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
package com.eclipsesource.uml.glsp.old.diagram.usecase_diagram;

public class UseCasePalette {
   /*-
   
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersUseCase(), relationsUseCase());
   }
   
   private PaletteItem classifiersUseCase() {
      PaletteItem createUseCase = node(UseCaseTypes.USECASE, "Use Case", "umlusecase");
      PaletteItem createPackage = node(UseCaseTypes.PACKAGE, "Package", "umlpackage");
      PaletteItem createComponent = node(UseCaseTypes.COMPONENT, "Component", "umlcomponent");
      PaletteItem createActor = node(UseCaseTypes.ACTOR, "Actor", "umlactor");
   
      List<PaletteItem> classifiers = Lists.newArrayList(createUseCase, createPackage, createComponent, createActor);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }
   
   private PaletteItem relationsUseCase() {
      PaletteItem createExtend = edge(UseCaseTypes.EXTEND, "Extend", "umlextend");
      PaletteItem createInclude = edge(UseCaseTypes.INCLUDE, "Include", "umlinclude");
      PaletteItem createGeneralization = edge(UseCaseTypes.GENERALIZATION, "Generalization", "umlgeneralization");
      PaletteItem createAssociation = edge(UseCaseTypes.USECASE_ASSOCIATION, "Association", "umlassociation");
   
      List<PaletteItem> relations = Lists.newArrayList(createExtend, createInclude, createGeneralization,
         createAssociation);
      return PaletteItem.createPaletteGroup("uml.relation", "Relations", relations, "symbol-property");
   }
   
   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }
   
   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }
   */
}

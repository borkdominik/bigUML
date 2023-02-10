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
package com.eclipsesource.uml.glsp.core;

import org.eclipse.emfcloud.modelserver.glsp.EMSModelState;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.EMSOperationActionHandler;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSGLSPNotationDiagramModule;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelState;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSChangeBoundsOperationHandler;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSChangeRoutingPointsOperationHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.idgen.FragmentIdGenerator;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.uml2.uml.UMLPackage;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.glsp.core.diagram.UmlToolDiagramConfiguration;
import com.eclipsesource.uml.glsp.core.features.context_menu.UmlContextMenuItemProvider;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapperRegistry;
import com.eclipsesource.uml.glsp.core.features.label_edit.UmlLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.core.features.tool_palette.UmlToolPaletteItemProvider;
import com.eclipsesource.uml.glsp.core.gmodel.DiagramMapper;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapperRegistry;
import com.eclipsesource.uml.glsp.core.gmodel.UmlGModelFactory;
import com.eclipsesource.uml.glsp.core.handler.action.UmlOperationActionHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.UmlChangeBoundsOperationHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.UmlChangeRoutingPointsOperationHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.UmlOperationHandlerRegistry;
import com.eclipsesource.uml.glsp.core.handler.operation.UmlOverrideOperationHandlerRegistry;
import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateHandlerRegistry;
import com.eclipsesource.uml.glsp.core.handler.operation.create.UmlCreateEdgeOperationHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.create.UmlCreateNodeOperationHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandlerRegistry;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.UmlDeleteOperationHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandlerRegistry;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UmlUpdateOperationHandler;
import com.eclipsesource.uml.glsp.core.manifest.CoreManifest;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.model.UmlSourceModelStorage;
import com.eclipsesource.uml.glsp.features.editor_panel.manifest.EditorPanelFeatureManifest;
import com.eclipsesource.uml.glsp.features.outline.manifest.OutlineFeatureManifest;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.PropertyPaletteFeatureManifest;
import com.eclipsesource.uml.glsp.features.validation.UmlDiagramModelValidator;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.manifest.ClassUmlManifest;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.manifest.CommunicationUmlManifest;
import com.eclipsesource.uml.modelserver.core.resource.UmlNotationResource;
import com.eclipsesource.uml.modelserver.unotation.UnotationPackage;
import com.google.inject.Singleton;

public class UmlDiagramModule extends EMSGLSPNotationDiagramModule {

   @Override
   protected void configureBase() {
      super.configureBase();
      configureFixes();
      configureMappers();
      configureRegistries();
   }

   protected void configureFixes() {
      bind(EMSModelState.class).to(bindGModelState());
      bind(EMSNotationModelState.class).to(bindGModelState());
   }

   protected void configureMappers() {
      bind(DiagramMapper.class).in(Singleton.class);
      bind(GModelMapHandler.class).in(Singleton.class);
      bind(GModelMapperRegistry.class).in(Singleton.class);
   }

   protected void configureRegistries() {
      bind(UmlOverrideOperationHandlerRegistry.class).in(Singleton.class);
      bind(DiagramCreateHandlerRegistry.class).in(Singleton.class);
      bind(DiagramDeleteHandlerRegistry.class).in(Singleton.class);
      bind(DiagramLabelEditMapperRegistry.class).in(Singleton.class);
      bind(DiagramUpdateHandlerRegistry.class).in(Singleton.class);
   }

   @Override
   protected void registerEPackages() {
      super.registerEPackages();
      UMLPackage.eINSTANCE.eClass();
      UnotationPackage.eINSTANCE.eClass();
   }

   @Override
   protected Class<? extends EMFIdGenerator> bindEMFIdGenerator() {
      return FragmentIdGenerator.class;
   }

   @Override
   protected Class<? extends UmlModelState> bindGModelState() {
      return UmlModelState.class;
   }

   @Override
   protected Class<? extends UmlSourceModelStorage> bindSourceModelStorage() {
      return UmlSourceModelStorage.class;
   }

   @Override
   public Class<? extends UmlGModelFactory> bindGModelFactory() {
      return UmlGModelFactory.class;
   }

   @Override
   protected Class<? extends UmlModelServerAccess> bindModelServerAccess() {
      return UmlModelServerAccess.class;
   }

   @Override
   protected Class<? extends UmlGraphExtension> bindGraphExtension() {
      return UmlGraphExtension.class;
   }

   @Override
   protected Class<? extends UmlToolPaletteItemProvider> bindToolPaletteItemProvider() {
      return UmlToolPaletteItemProvider.class;
   }

   @Override
   protected Class<? extends UmlToolDiagramConfiguration> bindDiagramConfiguration() {
      return UmlToolDiagramConfiguration.class;
   }

   @Override
   protected Class<? extends ModelValidator> bindModelValidator() {
      return UmlDiagramModelValidator.class;
   }

   @Override
   protected Class<? extends ContextMenuItemProvider> bindContextMenuItemProvider() {
      return UmlContextMenuItemProvider.class;
   }

   @Override
   protected Class<? extends UmlOperationHandlerRegistry> bindOperationHandlerRegistry() {
      return UmlOperationHandlerRegistry.class;
   }

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   protected String getSemanticFileExtension() { return UMLResource.FILE_EXTENSION; }

   @Override
   protected String getNotationFileExtension() { return UmlNotationResource.FILE_EXTENSION; }

   @Override
   protected void configureClientActions(final MultiBinding<Action> bindings) {
      super.configureClientActions(bindings);
      // bindings.add(ReturnTypesAction.class);
   }

   @Override
   protected void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      super.configureActionHandlers(bindings);
      // TODO: Rebind it
      // bindings.rebind(RequestClipboardDataActionHandler.class, UmlRequestClipboardDataActionHandler.class);
      // bindings.rebind(RequestMarkersHandler.class, UmlRequestMarkersHandler.class);

      bindings.rebind(EMSOperationActionHandler.class, UmlOperationActionHandler.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      super.configureOperationHandlers(bindings);
      bindings.rebind(EMSChangeBoundsOperationHandler.class, UmlChangeBoundsOperationHandler.class);
      bindings.rebind(EMSChangeRoutingPointsOperationHandler.class, UmlChangeRoutingPointsOperationHandler.class);

      bindings.add(UmlLabelEditOperationHandler.class);
      bindings.add(UmlCreateNodeOperationHandler.class);
      bindings.add(UmlCreateEdgeOperationHandler.class);
      bindings.add(UmlDeleteOperationHandler.class);
      bindings.add(UmlUpdateOperationHandler.class);
   }

   @Override
   protected void configureAdditionals() {
      super.configureAdditionals();

      // Core
      install(new CoreManifest());

      // Feature
      install(new OutlineFeatureManifest());
      install(new EditorPanelFeatureManifest());
      install(new PropertyPaletteFeatureManifest());

      // Diagram
      // install(new CommonUmlManifest());
      install(new ClassUmlManifest());
      install(new CommunicationUmlManifest());
   }
}

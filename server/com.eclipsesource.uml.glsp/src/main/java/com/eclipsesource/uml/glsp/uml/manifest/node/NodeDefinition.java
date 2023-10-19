/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.manifest.node;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramElementConfigurationContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.GModelMapperContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.manifest.ElementDefinition;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.multibindings.Multibinder;

public abstract class NodeDefinition extends ElementDefinition
   implements DiagramElementConfigurationContribution, DiagramCreateHandlerContribution,
   DiagramDeleteHandlerContribution, DiagramUpdateHandlerContribution, DiagramLabelEditMapperContribution,
   DiagramElementPropertyMapperContribution, GModelMapperContribution {

   public NodeDefinition(final String id, final Representation representation) {
      super(id, representation);
   }

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration(this::diagramConfigurations, (edges) -> {}, (ports) -> {});
      contributeDiagramCreateNodeHandlers(this::diagramCreateHandlers);
      contributeDiagramDeleteHandlers(this::diagramDeleteHandlers);
      contributeDiagramUpdateHandlers(this::diagramUpdateHandlers);

      contributeDiagramLabelEditMappers(this::diagramLabelEditMappers);
      contributeDiagramElementPropertyMappers(this::diagramPropertyPaletteMappers);

      contributeGModelMappers(this::gmodelMappers);
   }

   protected abstract void diagramConfigurations(Multibinder<DiagramElementConfiguration.Node> contribution);

   protected abstract void diagramCreateHandlers(Multibinder<DiagramCreateNodeHandler<?>> contribution);

   protected abstract void diagramDeleteHandlers(Multibinder<DiagramDeleteHandler<? extends EObject>> contribution);

   protected abstract void diagramUpdateHandlers(Multibinder<DiagramUpdateHandler<? extends EObject>> contribution);

   protected void diagramLabelEditMappers(final Multibinder<DiagramLabelEditMapper<? extends EObject>> contribution) {}

   protected void diagramPropertyPaletteMappers(
      final Multibinder<DiagramElementPropertyMapper<? extends EObject>> contribution) {}

   protected void gmodelMappers(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> contribution) {}

}

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
package com.eclipsesource.uml.glsp.uml.elements.association;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration.Edge;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateEdgeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.association.features.AssociationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.association.features.AssociationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.association.gmodel.AssociationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.manifest.EdgeDefinition;
import com.google.inject.multibindings.Multibinder;

public class AssociationDefinitionModule extends EdgeDefinition {

   public AssociationDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected void diagramConfigurations(final Multibinder<Edge> contribution) {
      contribution.addBinding().to(AssociationConfiguration.Diagram.class);
   }

   @Override
   protected void diagramCreateHandlers(final Multibinder<DiagramCreateEdgeHandler> contribution) {
      contribution.addBinding().to(AssociationDefaultHandler.class);
   }

   @Override
   protected void diagramDeleteHandlers(final Multibinder<DiagramDeleteHandler<? extends EObject>> contribution) {
      contribution.addBinding().to(AssociationDefaultHandler.class);
   }

   @Override
   protected void diagramUpdateHandlers(final Multibinder<DiagramUpdateHandler<? extends EObject>> contribution) {
      contribution.addBinding().to(AssociationDefaultHandler.class);
   }

   @Override
   protected void diagramLabelEditMappers(final Multibinder<DiagramLabelEditMapper<? extends EObject>> contribution) {
      contribution.addBinding().to(AssociationLabelEditMapper.class);
   }

   @Override
   protected void diagramPropertyPaletteMappers(
      final Multibinder<DiagramElementPropertyMapper<? extends EObject>> contribution) {
      contribution.addBinding().to(AssociationPropertyMapper.class);
   }

   @Override
   protected void gmodelMappers(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> contribution) {
      contribution.addBinding().to(AssociationEdgeMapper.class);
   }
}

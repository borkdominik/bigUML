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
package com.eclipsesource.uml.glsp.uml.elements.subject;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration.Node;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.subject.features.SubjectLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.subject.features.SubjectPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.subject.gmodel.SubjectNodeMapper;
import com.eclipsesource.uml.glsp.uml.manifest.NodeDefinition;
import com.google.inject.multibindings.Multibinder;

public class SubjectDefinitionModule extends NodeDefinition {

   public SubjectDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected void diagramConfigurations(final Multibinder<Node> nodes) {
      nodes.addBinding().to(SubjectConfiguration.Diagram.class);
   }

   @Override
   protected void diagramCreateHandlers(final Multibinder<DiagramCreateNodeHandler> contribution) {
      contribution.addBinding().to(SubjectDefaultHandler.class);
   }

   @Override
   protected void diagramDeleteHandlers(final Multibinder<DiagramDeleteHandler<? extends EObject>> contribution) {
      contribution.addBinding().to(SubjectDefaultHandler.class);
   }

   @Override
   protected void diagramUpdateHandlers(final Multibinder<DiagramUpdateHandler<? extends EObject>> contribution) {
      contribution.addBinding().to(SubjectDefaultHandler.class);
   }

   @Override
   protected void diagramLabelEditMappers(final Multibinder<DiagramLabelEditMapper<? extends EObject>> contribution) {
      contribution.addBinding().to(SubjectLabelEditMapper.class);
   }

   @Override
   protected void diagramPropertyPaletteMappers(
      final Multibinder<DiagramElementPropertyMapper<? extends EObject>> contribution) {
      contribution.addBinding().to(SubjectPropertyMapper.class);
   }

   @Override
   protected void gmodelMappers(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> contribution) {
      contribution.addBinding().to(SubjectNodeMapper.class);
   }
}

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
package com.eclipsesource.uml.glsp.uml.elements.property;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration.Node;
import com.eclipsesource.uml.glsp.core.features.id_generator.SuffixIdAppender;
import com.eclipsesource.uml.glsp.core.features.label_edit.validation.DiagramLabelEditValidator;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditValidatorContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.property.features.PropertyLabelEditValidator;
import com.eclipsesource.uml.glsp.uml.elements.property.features.PropertyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.PropertyCompartmentMapper;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.manifest.node.NodeOperationHandlerDefinition;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public class PropertyDefinitionModule extends NodeOperationHandlerDefinition
   implements SuffixIdAppenderContribution, DiagramLabelEditValidatorContribution {

   public PropertyDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation());
   }

   @Override
   protected void configure() {
      super.configure();

      contributeSuffixIdAppenders(this::suffixIdAppenders);
      contributeDiagramLabelEditValidators(this::labelEditValidators);
   }

   @Override
   protected void diagramConfigurations(final Multibinder<Node> nodes) {
      nodes.addBinding().to(PropertyConfiguration.Diagram.class);
   }

   @Override
   protected Optional<TypeLiteral<? extends NodeOperationHandler<?, ?>>> operationHandler() {
      return Optional.of(new TypeLiteral<PropertyOperationHandler>() {});
   }

   @Override
   protected void gmodelMappers(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> contribution) {
      contribution.addBinding().to(PropertyCompartmentMapper.class);
   }

   protected void suffixIdAppenders(final MapBinder<String, SuffixIdAppender> contribution) {
      contribution.addBinding(PropertyMultiplicityLabelSuffix.SUFFIX)
         .to(PropertyMultiplicityLabelSuffix.class);
      contribution.addBinding(PropertyTypeLabelSuffix.SUFFIX).to(PropertyTypeLabelSuffix.class);
   }

   protected void labelEditValidators(
      final Multibinder<DiagramLabelEditValidator<? extends EObject>> contribution) {
      contribution.addBinding().to(PropertyLabelEditValidator.class);
   }

   @Override
   protected void diagramPropertyPaletteMappers(
      final Multibinder<DiagramElementPropertyMapper<? extends EObject>> contribution) {
      contribution.addBinding().to(PropertyPropertyMapper.class);
   }

}

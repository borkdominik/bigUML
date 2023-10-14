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

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.features.id_generator.SuffixIdAppender;
import com.eclipsesource.uml.glsp.core.features.label_edit.validation.DiagramLabelEditValidator;
import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditValidatorContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.features.autocomplete.manifest.contributions.DiagramAutocompleteEntriesProviderContribution;
import com.eclipsesource.uml.glsp.features.autocomplete.provider.DiagramAutocompleteEntriesProvider;
import com.eclipsesource.uml.glsp.uml.elements.property.features.PropertyLabelEditValidator;
import com.eclipsesource.uml.glsp.uml.elements.property.features.PropertyTypeAutocompleteProvider;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.manifest.node.NodeFactoryDefinition;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public class PropertyDefinitionModule extends NodeFactoryDefinition
   implements SuffixIdAppenderContribution, DiagramLabelEditValidatorContribution,
   DiagramAutocompleteEntriesProviderContribution {

   public PropertyDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation(), PropertyFactory.class);
   }

   @Override
   protected void configure() {
      super.configure();

      contributeSuffixIdAppenders(this::suffixIdAppenders);
      contributeDiagramLabelEditValidators(this::labelEditValidators);
      contributeAutocompleteEntriesProviders(this::autocompleteEntriesProviders);
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

   protected void autocompleteEntriesProviders(
      final Multibinder<DiagramAutocompleteEntriesProvider> contribution) {
      contribution.addBinding().to(PropertyTypeAutocompleteProvider.class);
   }
}

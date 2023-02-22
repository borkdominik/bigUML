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
package com.eclipsesource.uml.modelserver.shared.matcher;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.StreamUtil;

public class CrossReferenceFinder<TProcessedResult> {
   protected final ModelContext modelContext;
   protected final Set<CrossReferenceProcessor<TProcessedResult>> processors;

   public CrossReferenceFinder(
      final ModelContext modelContext,
      final Set<CrossReferenceProcessor<TProcessedResult>> processors) {
      this.modelContext = modelContext;
      this.processors = processors;
   }

   public Set<TProcessedResult> find(final MatcherContext context, final EObject interest, final Resource resource) {
      var settings = UsageCrossReferencer
         .find(interest, resource);

      return find(context, interest, settings);
   }

   protected Set<TProcessedResult> find(final MatcherContext context, final EObject interest,
      final Collection<Setting> settings) {
      var results = new HashSet<TProcessedResult>();
      var filteredSettings = settings.stream()
         .filter(StreamUtil.distinctByKey(Setting::getEObject))
         .filter(setting -> !context.processedSettings.contains(setting))
         .collect(Collectors.toList());

      for (var setting : filteredSettings) {
         context.processedSettings.add(setting);

         for (var processor : processors) {
            results.addAll(processor.process(modelContext, setting, interest));
         }
      }

      return results;
   }
}

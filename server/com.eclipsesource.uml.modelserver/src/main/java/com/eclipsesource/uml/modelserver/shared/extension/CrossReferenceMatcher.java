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
package com.eclipsesource.uml.modelserver.shared.extension;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;

import com.eclipsesource.uml.modelserver.shared.utils.StreamUtil;

public class CrossReferenceMatcher<T> {
   protected final Map<BiFunction<Setting, EObject, Boolean>, BiFunction<Setting, EObject, T>> matchers;

   protected CrossReferenceMatcher(
      final Map<BiFunction<Setting, EObject, Boolean>, BiFunction<Setting, EObject, T>> matchers) {
      this.matchers = matchers;
   }

   public List<T> findMatches(final EObject context, final Resource resource) {
      var matches = new ArrayList<T>();
      var settings = UsageCrossReferencer
         .find(context, resource)
         .stream()
         .filter(s -> !(s instanceof Collection<?>))
         .filter(StreamUtil.distinctByKey(Setting::getEObject))
         .collect(Collectors.toList());

      for (var setting : settings) {
         for (var entry : matchers.entrySet()) {
            var match = entry.getKey();
            var consumer = entry.getValue();
            if (match.apply(setting, context)) {
               matches.add(consumer.apply(setting, context));
               break;
            }
         }
      }

      return matches;
   }

   public static class Builder<T> {
      private final Map<BiFunction<Setting, EObject, Boolean>, BiFunction<Setting, EObject, T>> matchers = new HashMap<>();

      public Builder<T> match(final BiFunction<Setting, EObject, Boolean> match,
         final BiFunction<Setting, EObject, T> consumer) {
         matchers.put(match, consumer);
         return this;
      }

      public CrossReferenceMatcher<T> build() {
         return new CrossReferenceMatcher<>(matchers);
      }
   }
}

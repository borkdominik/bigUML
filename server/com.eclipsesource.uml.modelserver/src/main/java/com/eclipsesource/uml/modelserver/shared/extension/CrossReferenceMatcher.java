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
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;

import com.eclipsesource.uml.modelserver.shared.utils.StreamUtil;

public class CrossReferenceMatcher<T> {
   protected final List<BiFunction<Setting, EObject, Optional<T>>> matchers;

   protected CrossReferenceMatcher(
      final List<BiFunction<Setting, EObject, Optional<T>>> matchers) {
      this.matchers = matchers;
   }

   public List<T> find(final EObject interest, final Resource resource) {
      var settings = UsageCrossReferencer
         .find(interest, resource);

      return find(settings, interest);
   }

   protected List<T> find(final Collection<Setting> settings, final EObject interest) {
      var matches = new ArrayList<T>();
      var filteredSettings = settings.stream()
         .filter(StreamUtil.distinctByKey(Setting::getEObject))
         .collect(Collectors.toList());

      for (var setting : filteredSettings) {
         for (var matcher : matchers) {

            matcher.apply(setting, interest).ifPresent(matches::add);
         }
      }

      return matches;

   }

   public static class Builder<T> {
      private final List<BiFunction<Setting, EObject, Optional<T>>> matchers = new LinkedList<>();

      public Builder<T> match(final BiFunction<Setting, EObject, Optional<T>> match) {
         matchers.add(match);
         return this;
      }

      public CrossReferenceMatcher<T> build() {
         return new CrossReferenceMatcher<>(matchers);
      }
   }
}

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
package com.eclipsesource.uml.modelserver.uml.reference;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceFinder;
import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.matcher.MatcherContext;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;

public final class CrossReferenceRemover {
   public static String MATCHER_CONTEXT_KEY = "matcher_context";

   private final ModelContext context;
   private final CrossReferenceFinder<Command> finder;

   public CrossReferenceRemover(final ModelContext context) {
      super();
      this.context = context;

      var processors = context.injector.map(i -> {
         var map = i.getInstance(
            Key.get(new TypeLiteral<Map<Representation, Set<CrossReferenceRemoveProcessor<? extends EObject>>>>() {}));

         return map.getOrDefault(context.representation(), Set.of()).stream().map(v -> {
            return (CrossReferenceProcessor<Command>) v;
         }).collect(Collectors.toSet());

      }).orElse(Set.of());

      this.finder = new CrossReferenceFinder<>(context, processors);

      context.data.putIfAbsent(MATCHER_CONTEXT_KEY, new MatcherContext());

   }

   public Set<Command> deleteCommandsFor(final EObject interest) {
      var matcherContext = context.get(MATCHER_CONTEXT_KEY, MatcherContext.class).get();

      return finder.find(matcherContext, interest, context.model.eResource());
   }
}

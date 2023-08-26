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
package com.eclipsesource.uml.modelserver.uml.behavior.cross_delete;

import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceFinder;
import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceProcessor;
import com.eclipsesource.uml.modelserver.shared.matcher.MatcherContext;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.BehaviorRegistry;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public class CrossReferenceDeleter {
   public static String MATCHER_CONTEXT_KEY = "matcher_context";

   @Inject
   protected BehaviorRegistry registry;

   public Set<Command> deleteCommandsFor(final ModelContext context, final EObject interest) {
      var behaviors = registry.getAll(context.representation(),
         new TypeLiteral<CrossReferenceDeleteBehavior<EObject>>() {});
      var processors = behaviors.stream().map(b -> (CrossReferenceProcessor<Command>) b).collect(Collectors.toSet());

      context.data.putIfAbsent(MATCHER_CONTEXT_KEY, new MatcherContext());
      var matcherContext = context.get(MATCHER_CONTEXT_KEY, MatcherContext.class).orElseThrow();
      var finder = new CrossReferenceFinder<>(context, processors);

      return finder.find(matcherContext, interest, context.model.eResource());
   }
}

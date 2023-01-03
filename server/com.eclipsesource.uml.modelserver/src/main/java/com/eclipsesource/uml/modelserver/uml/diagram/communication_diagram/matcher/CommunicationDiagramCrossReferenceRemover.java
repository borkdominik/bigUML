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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.matcher;

import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceMatcher;
import com.eclipsesource.uml.modelserver.shared.matcher.MatcherContext;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline.DeleteLifelineCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.DeleteMessageCompoundCommand;

public final class CommunicationDiagramCrossReferenceRemover {
   public static String MATCHER_CONTEXT_KEY = "matcher_context";

   private final ModelContext context;
   private final CrossReferenceMatcher<Command> matcher;

   public CommunicationDiagramCrossReferenceRemover(final ModelContext context) {
      super();

      this.context = context;
      this.matcher = new CrossReferenceMatcher.Builder<Command>()
         .match((setting, interest) -> LifelineMatcher
            .ofChildUsage(setting, interest)
            .map(lifeline -> new DeleteLifelineCompoundCommand(context, lifeline)))
         .match((setting, interest) -> MessageMatcher
            .ofChildUsage(setting, interest)
            .map(message -> new DeleteMessageCompoundCommand(context, message)))
         .match((setting, interest) -> MessageMatcher
            .ofInverseMessageUsageSpecificationUsage(setting, interest)
            .map(message -> new DeleteMessageCompoundCommand(context, message)))
         .build();

      context.data.putIfAbsent(MATCHER_CONTEXT_KEY, new MatcherContext());
   }

   public Set<Command> deleteCommandsFor(final EObject interest) {
      var matcherContext = context.get(MATCHER_CONTEXT_KEY, MatcherContext.class).get();

      return matcher.find(matcherContext, interest, context.model.eResource());
   }
}

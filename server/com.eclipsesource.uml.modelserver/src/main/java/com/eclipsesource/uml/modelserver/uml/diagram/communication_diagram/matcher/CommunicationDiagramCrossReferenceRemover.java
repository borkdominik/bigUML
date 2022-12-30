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
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceMatcher;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline.DeleteLifelineCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.DeleteMessageCompoundCommand;

public final class CommunicationDiagramCrossReferenceRemover {
   private final Model model;
   private final CrossReferenceMatcher<Command> matcher;

   public CommunicationDiagramCrossReferenceRemover(final ModelContext context) {
      super();

      model = UmlSemanticUtil.getModel(context);
      matcher = new CrossReferenceMatcher.Builder<Command>()
         .match((setting, interest) -> LifelineMatcher
            .ofUsage(setting, interest)
            .map(lifeline -> new DeleteLifelineCompoundCommand(context, lifeline)))
         .match((setting, interest) -> MessageMatcher
            .ofUsage(setting, interest)
            .map(message -> new DeleteMessageCompoundCommand(context, message)))
         .match((setting, interest) -> MessageMatcher
            .ofInverseMessageUsageSpecificationUsage(setting, interest)
            .map(specification -> new DeleteMessageCompoundCommand(context, specification.getMessage())))
         .build();
   }

   public Set<Command> deleteCommandsFor(final EObject interest) {
      return matcher.find(null, interest, model.eResource());
   }
}

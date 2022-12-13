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

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.extension.CrossReferenceMatcher;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline.RemoveLifelineCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.RemoveMessageCompoundCommand;

public class CommunicationDiagramCrossReferenceRemover {
   protected final Model model;
   protected final CrossReferenceMatcher<Command> matcher;

   public CommunicationDiagramCrossReferenceRemover(final EditingDomain domain, final URI modelUri) {
      super();

      model = UmlSemanticUtil.getModel(modelUri, domain);
      matcher = new CrossReferenceMatcher.Builder<Command>()
         .match(LifelineMatcher::isUsage, (setting, context) -> {
            var lifeline = (Lifeline) setting.getEObject();
            return new RemoveLifelineCompoundCommand(domain, modelUri, lifeline);
         })
         .match(LifelineMatcher::isInverseMessageUsageSpecificationUsage, (setting, context) -> {
            var messageOccureneSpecification = (MessageOccurrenceSpecification) setting.getEObject();
            return new RemoveMessageCompoundCommand(domain, modelUri, messageOccureneSpecification.getMessage());
         })
         .match(MessageMatcher::isUsage, (setting, context) -> {
            var message = (Message) setting.getEObject();
            return new RemoveMessageCompoundCommand(domain, modelUri, message);
         })
         .build();
   }

   public List<Command> removeCommandsFor(final EObject elementToRemove) {
      return matcher.find(elementToRemove, model.eResource());
   }
}

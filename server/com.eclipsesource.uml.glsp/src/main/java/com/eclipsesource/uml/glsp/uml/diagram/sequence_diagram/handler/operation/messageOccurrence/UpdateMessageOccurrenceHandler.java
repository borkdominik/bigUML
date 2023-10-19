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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.messageOccurrence;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_MessageOccurrence;
import com.eclipsesource.uml.glsp.uml.handler.operations.update.BaseUpdateElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.UpdateMessageOccurrenceArgument;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.UpdateMessageOccurrenceContribution;

public final class UpdateMessageOccurrenceHandler
   extends BaseUpdateElementHandler<MessageOccurrenceSpecification, UpdateMessageOccurrenceArgument> {

   public UpdateMessageOccurrenceHandler() {
      super(UmlSequence_MessageOccurrence.typeId());
   }

   @Override
   protected CCommand createCommand(final UpdateOperation operation, final MessageOccurrenceSpecification element,
      final UpdateMessageOccurrenceArgument updateArgument) {
      return UpdateMessageOccurrenceContribution.create(element, updateArgument);
   }
}

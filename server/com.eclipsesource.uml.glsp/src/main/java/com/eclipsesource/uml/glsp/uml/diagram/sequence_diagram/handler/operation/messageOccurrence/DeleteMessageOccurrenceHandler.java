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

import com.eclipsesource.uml.glsp.uml.handler.operations.delete.BaseDeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.DeleteMessageOccurenceContribution;

public class DeleteMessageOccurrenceHandler extends BaseDeleteElementHandler<MessageOccurrenceSpecification> {

   @Override
   protected CCommand createCommand(final MessageOccurrenceSpecification element) {
      return DeleteMessageOccurenceContribution.create(element);
   }

}

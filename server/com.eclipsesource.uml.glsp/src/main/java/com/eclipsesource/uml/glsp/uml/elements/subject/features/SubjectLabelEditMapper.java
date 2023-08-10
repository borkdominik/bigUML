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
package com.eclipsesource.uml.glsp.uml.elements.subject.features;

import java.util.Optional;

import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.uml2.uml.Component;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.elements.subject.SubjectDefaultHandler;
import com.eclipsesource.uml.glsp.uml.features.label_edit.BaseLabelEditMapper;
import com.eclipsesource.uml.modelserver.uml.elements.subject.commands.UpdateSubjectArgument;

public class SubjectLabelEditMapper extends BaseLabelEditMapper<Component> {
   @Override
   public Optional<UpdateOperation> map(final ApplyLabelEditOperation operation) {
      var handler = getHandler(SubjectDefaultHandler.class, operation);
      UpdateOperation update = null;

      if (matches(operation, CoreTypes.LABEL_NAME, NameLabelSuffix.SUFFIX)) {
         update = handler.withArgument(
            new UpdateSubjectArgument.Builder()
               .name(operation.getText())
               .get());
      }

      return withContext(update);
   }
}

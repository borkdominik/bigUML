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
package com.eclipsesource.uml.glsp.uml.elements.usecase.features;

import java.util.Optional;

import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.uml.elements.usecase.UseCaseDefaultHandler;
import com.eclipsesource.uml.glsp.uml.features.label_edit.BaseLabelEditMapper;
import com.eclipsesource.uml.modelserver.uml.elements.usecase.commands.UpdateUseCaseArgument;

public class UseCaseLabelEditMapper extends BaseLabelEditMapper<UseCase> {
   @Override
   public Optional<UpdateOperation> map(final ApplyLabelEditOperation operation) {
      var handler = getHandler(UseCaseDefaultHandler.class, operation);
      UpdateOperation update = null;

      if (matches(operation, CoreTypes.LABEL_NAME, NameLabelSuffix.SUFFIX)) {
         update = handler.withArgument(
            new UpdateUseCaseArgument.Builder()
               .name(operation.getText())
               .get());
      }

      return withContext(update);
   }
}

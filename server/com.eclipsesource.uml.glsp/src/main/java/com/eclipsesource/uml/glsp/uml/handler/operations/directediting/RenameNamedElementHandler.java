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
package com.eclipsesource.uml.glsp.uml.handler.operations.directediting;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.commands.RenameElementContribution;

public abstract class RenameNamedElementHandler<T extends NamedElement> extends BaseLabelEditHandler<T> {

   public RenameNamedElementHandler() {
      this(CoreTypes.LABEL_NAME, NameLabelSuffix.SUFFIX);
   }

   public RenameNamedElementHandler(final String suffix) {
      this(CoreTypes.LABEL_NAME, suffix);
   }

   public RenameNamedElementHandler(final String type, final String suffix) {
      super(type, suffix);
   }

   @Override
   protected CCommand createCommand(final ApplyLabelEditOperation operation, final T element) {
      return RenameElementContribution.create(element, operation.getText());
   }

}

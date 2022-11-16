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
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.commands.RenameElementContribution;

public class DefaultRenameNamedElementHandler<T extends NamedElement> extends BaseLabelEditHandler<T> {

   public DefaultRenameNamedElementHandler(final String suffix) {
      super(UmlConfig.Types.LABEL_NAME, suffix);
   }

   @Override
   protected CCommand command(final T element, final String newText) {
      return RenameElementContribution.create(element, newText);
   }

}

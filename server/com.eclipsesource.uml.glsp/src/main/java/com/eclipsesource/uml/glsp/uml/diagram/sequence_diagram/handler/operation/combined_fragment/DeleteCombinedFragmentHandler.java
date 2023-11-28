/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.combined_fragment;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.CombinedFragment;

import com.eclipsesource.uml.glsp.uml.handler.operations.delete.BaseDeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.combined_fragment.DeleteCombinedFragmentContribution;

public final class DeleteCombinedFragmentHandler extends BaseDeleteElementHandler<CombinedFragment> {

   @Override
   protected CCommand createCommand(final CombinedFragment element) {
      return DeleteCombinedFragmentContribution.create(element);
   }
}

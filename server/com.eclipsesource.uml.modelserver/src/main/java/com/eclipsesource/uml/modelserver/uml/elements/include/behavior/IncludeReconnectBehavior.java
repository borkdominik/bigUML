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
package com.eclipsesource.uml.modelserver.uml.elements.include.behavior;

import java.util.List;

import org.eclipse.uml2.uml.Include;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.reconnect.BaseReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.elements.include.commands.UpdateIncludeArgument;

public class IncludeReconnectBehavior<TElement extends Include> extends BaseReconnectBehavior<TElement> {

   @Override
   protected UpdateIncludeArgument argument(final ModelContext context, final TElement element,
      final List<String> sources,
      final List<String> targets) {
      var source = sources.get(0);
      var target = targets.get(0);
      return UpdateIncludeArgument.by().includingCaseId(source).additionId(target).build();
   }
}

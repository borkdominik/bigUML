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
package com.eclipsesource.uml.modelserver.uml.elements.generalization.behavior;

import java.util.ArrayList;
import java.util.Set;

import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.base.BaseReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.elements.generalization.commands.UpdateGeneralizationArgument;

public class GeneralizationReconnectBehavior<TElement extends Generalization> extends BaseReconnectBehavior<TElement> {
   @Override
   protected UpdateGeneralizationArgument argument(final ModelContext context, final TElement element,
      final Set<String> sources,
      final Set<String> targets) {
      var specificId = new ArrayList<>(sources).get(0);
      var generalId = new ArrayList<>(targets).get(0);

      return UpdateGeneralizationArgument.by().specificId(specificId).generalId(generalId).build();
   }
}

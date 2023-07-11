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
package com.eclipsesource.uml.modelserver.core.commands.copy_paste;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil.Copier;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public interface CopyBehaviorInfluencer {
   default List<Command> modifyReferences(final ModelContext context, final Collection<? extends EObject> elements,
      final Copier copier) {
      return List.of();
   }

   boolean shouldIgnore(Collection<? extends EObject> elements, EObject original);
}

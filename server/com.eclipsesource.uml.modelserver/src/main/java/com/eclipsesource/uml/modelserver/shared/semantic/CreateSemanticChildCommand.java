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
package com.eclipsesource.uml.modelserver.shared.semantic;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class CreateSemanticChildCommand<TParent, TChild> extends UmlSemanticElementCommand {

   protected final TParent parent;

   public CreateSemanticChildCommand(final ModelContext context, final TParent parent) {
      super(context);
      this.parent = parent;
   }

   abstract public TChild getCreatedSemanticElement();
}

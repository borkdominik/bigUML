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

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class BaseDeleteSemanticChildCommand<TParent, TChild extends EObject>
   extends BaseSemanticElementCommand {

   protected TParent parent;
   protected TChild child;

   public BaseDeleteSemanticChildCommand(final ModelContext context, final TParent parent, final TChild child) {
      super(context);
      this.parent = parent;
      this.child = child;
   }

   @Override
   protected void doExecute() {
      if (this.deletionAllowed()) {
         deleteSemanticElement(parent, child);
      }
   }

   protected boolean deletionAllowed() {
      return this.parent != null;
   }

   abstract protected void deleteSemanticElement(TParent parent, TChild child);
}

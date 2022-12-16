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
package com.eclipsesource.uml.modelserver.shared.semantic;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emf.transaction.RecordingCommand;
import org.eclipse.emf.transaction.TransactionalEditingDomain;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class UmlSemanticElementCommand extends RecordingCommand {

   protected final Model model;
   protected final SemanticElementAccessor semanticElementAccessor;

   @Deprecated
   public UmlSemanticElementCommand(final EditingDomain domain, final URI modelUri) {
      this(ModelContext.of(modelUri, domain));
   }

   public UmlSemanticElementCommand(final ModelContext context) {
      super((TransactionalEditingDomain) context.domain);
      this.semanticElementAccessor = new SemanticElementAccessor(context);
      this.model = semanticElementAccessor.getModel();
   }

}

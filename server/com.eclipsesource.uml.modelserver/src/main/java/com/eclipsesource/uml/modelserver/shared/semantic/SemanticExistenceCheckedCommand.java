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

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class SemanticExistenceCheckedCommand<TSemantic extends EObject> extends UmlSemanticElementCommand {
   private static Logger LOGGER = LogManager.getLogger(SemanticExistenceCheckedCommand.class.getSimpleName());

   protected final TSemantic semanticElement;

   public SemanticExistenceCheckedCommand(final ModelContext context, final TSemantic semanticElement) {
      super(context);
      this.semanticElement = semanticElement;
   }

   @Override
   protected void doExecute() {
      if (this.semanticElementExists()) {
         doChanges(semanticElement);
      }
   }

   protected boolean semanticElementExists() {
      return this.semanticElement.eContainer() != null;
   }

   abstract protected void doChanges(TSemantic semanticElement);

}

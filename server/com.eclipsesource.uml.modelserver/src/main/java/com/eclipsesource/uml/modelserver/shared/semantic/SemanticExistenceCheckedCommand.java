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
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;

public abstract class SemanticExistenceCheckedCommand<T extends EObject> extends UmlSemanticElementCommand {
   private static Logger LOGGER = LogManager.getLogger(SemanticExistenceCheckedCommand.class.getSimpleName());

   protected final T semanticElement;

   public SemanticExistenceCheckedCommand(final EditingDomain domain, final URI modelUri, final T semanticElement) {
      super(domain, modelUri);
      this.semanticElement = semanticElement;
   }

   @Override
   protected void doExecute() {
      if (this.semanticElementExists()) {
         doChanges();
      }
   }

   protected boolean semanticElementExists() {
      return this.semanticElement.eContainer() != null;
   }

   abstract protected void doChanges();

}

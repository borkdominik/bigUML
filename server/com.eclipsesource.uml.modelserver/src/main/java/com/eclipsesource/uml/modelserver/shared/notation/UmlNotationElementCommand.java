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
package com.eclipsesource.uml.modelserver.shared.notation;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emf.transaction.RecordingCommand;
import org.eclipse.emf.transaction.TransactionalEditingDomain;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public abstract class UmlNotationElementCommand extends RecordingCommand {

   protected final Diagram diagram;
   protected final Model model;

   protected final SemanticElementAccessor semanticElementAccessor;
   protected final NotationElementAccessor notationElementAccessor;

   public UmlNotationElementCommand(final EditingDomain domain, final URI modelUri) {
      super((TransactionalEditingDomain) domain);
      this.notationElementAccessor = new NotationElementAccessor(modelUri, domain);
      this.semanticElementAccessor = new SemanticElementAccessor(modelUri, domain);

      this.diagram = notationElementAccessor.getDiagram();
      this.model = semanticElementAccessor.getModel();
   }

}

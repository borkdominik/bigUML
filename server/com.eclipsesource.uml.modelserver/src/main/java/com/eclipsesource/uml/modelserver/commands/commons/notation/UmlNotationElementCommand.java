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
package com.eclipsesource.uml.modelserver.commands.commons.notation;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emf.transaction.RecordingCommand;
import org.eclipse.emf.transaction.TransactionalEditingDomain;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Diagram;

public abstract class UmlNotationElementCommand extends RecordingCommand {

   protected final Diagram umlDiagram;
   protected final Model umlModel;

   protected final EditingDomain domain;
   protected final URI modelUri;

   public UmlNotationElementCommand(final EditingDomain domain, final URI modelUri) {
      super((TransactionalEditingDomain) domain);
      this.domain = domain;
      this.modelUri = modelUri;

      this.umlDiagram = UmlNotationCommandUtil.getDiagram(modelUri, domain);
      this.umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
   }

}

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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.shared.notation;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;

public abstract class SDBaseNotationExistenceCheckedCommand<TSemantic extends EObject, TNotation extends NotationElement>
   extends BaseNotationElementCommand {

   protected final TSemantic semanticElement;
   protected final Class<TNotation> notationElementClass;

   public SDBaseNotationExistenceCheckedCommand(final ModelContext context,
      final TSemantic semanticElement) {
      super(context);
      notationElementClass = GenericsUtil.getClassParameter(
         getClass(),
         SDBaseNotationExistenceCheckedCommand.class, 1);
      this.semanticElement = semanticElement;
   }

   @Override
   protected void doExecute() {
      this.doChanges(semanticElement);
   }

   abstract protected void doChanges(TSemantic semanticElement);

}

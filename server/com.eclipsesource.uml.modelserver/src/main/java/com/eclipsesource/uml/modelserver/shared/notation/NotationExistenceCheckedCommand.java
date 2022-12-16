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

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;

import com.eclipsesource.uml.modelserver.core.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public abstract class NotationExistenceCheckedCommand<TSemantic extends EObject, TNotation extends NotationElement>
   extends UmlNotationElementCommand {

   protected final TSemantic semanticElement;
   protected final Optional<TNotation> notationElement;
   protected final Class<TNotation> notationElementClass;

   public NotationExistenceCheckedCommand(final ModelContext context,
      final TSemantic semanticElement) {
      super(context);
      notationElementClass = GenericsUtil.getClassParameter(getClass(), NotationExistenceCheckedCommand.class, 1);

      this.semanticElement = semanticElement;

      var semanticElementId = SemanticElementAccessor.getId(semanticElement);
      this.notationElement = notationElementAccessor.getElement(semanticElementId, notationElementClass);
   }

   @Override
   protected void doExecute() {
      notationElement.ifPresent(this::doChanges);
   }

   abstract protected void doChanges(TNotation notationElement);

}

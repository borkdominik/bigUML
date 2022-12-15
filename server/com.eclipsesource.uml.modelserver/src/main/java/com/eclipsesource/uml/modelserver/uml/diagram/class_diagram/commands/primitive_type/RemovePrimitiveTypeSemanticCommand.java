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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.modelserver.shared.semantic.SemanticExistenceCheckedCommand;

public class RemovePrimitiveTypeSemanticCommand extends SemanticExistenceCheckedCommand<DataType> {

   public RemovePrimitiveTypeSemanticCommand(final EditingDomain domain, final URI modelUri,
      final PrimitiveType primitiveType) {
      super(domain, modelUri, primitiveType);
   }

   @Override
   protected void doChanges() {
      model.getPackagedElements().remove(semanticElement);
   }
}

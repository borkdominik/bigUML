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
package com.eclipsesource.uml.modelserver.commands.semantic;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class SetPropertyTypeCommand extends UmlSemanticElementCommand {

   protected String semanticUriFragment;
   protected Type newType;

   public SetPropertyTypeCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment,
      final Type newType) {
      super(domain, modelUri);
      this.semanticUriFragment = semanticUriFragment;
      this.newType = newType;
   }

   @Override
   protected void doExecute() {
      Property property = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Property.class);
      property.setType(newType);
   }

}

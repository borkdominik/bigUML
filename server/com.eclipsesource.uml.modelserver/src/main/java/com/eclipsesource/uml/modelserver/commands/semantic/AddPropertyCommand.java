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
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddPropertyCommand extends UmlSemanticElementCommand {

   protected final String parentSemanticUriFragment;

   public AddPropertyCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUriFragment) {
      super(domain, modelUri);
      this.parentSemanticUriFragment = parentSemanticUriFragment;
   }

   @Override
   protected void doExecute() {
      Class parentClass = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Class.class);
      Property newProperty = UMLFactory.eINSTANCE.createProperty();
      newProperty.setName(UmlSemanticCommandUtil.getNewPropertyName(parentClass));
      parentClass.getOwnedAttributes().add(newProperty);
   }

}

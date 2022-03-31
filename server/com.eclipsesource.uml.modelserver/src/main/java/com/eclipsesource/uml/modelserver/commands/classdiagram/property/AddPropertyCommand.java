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
package com.eclipsesource.uml.modelserver.commands.classdiagram.property;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.UMLFactory;

public class AddPropertyCommand extends UmlSemanticElementCommand {

   protected final String parentSemanticUriFragment;
   protected final Type defaultType;

   public AddPropertyCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUriFragment) {
      super(domain, modelUri);
      this.parentSemanticUriFragment = parentSemanticUriFragment;
      this.defaultType = UmlSemanticCommandUtil.getType(domain, "String");
   }

   @Override
   protected void doExecute() {
      Class parentClass = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Class.class);
      Property newProperty = UMLFactory.eINSTANCE.createProperty();
      newProperty.setName(UmlSemanticCommandUtil.getNewPropertyName(parentClass));
      newProperty.setType(defaultType);
      parentClass.getOwnedAttributes().add(newProperty);
   }

}

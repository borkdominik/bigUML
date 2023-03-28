/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.label_edit.validation;

import java.util.Set;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.EnumerationLiteral;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.uml.features.label_edit.BaseLabelEditValidator;

public class BlankLabelEditValidator extends BaseLabelEditValidator<Element> {

   @Override
   public Set<Class<? extends Element>> getElementTypes() {
      return Set.of(org.eclipse.uml2.uml.Class.class, Interface.class, DataType.class, Enumeration.class,
         EnumerationLiteral.class, Operation.class, PrimitiveType.class);
   }

   @Override
   protected ValidationStatus validateLabelEdit(final String label, final GModelElement source, final Element element) {
      if (label.isBlank()) {
         return ValidationStatus.error("Blank values are not allowed.");
      }

      return ValidationStatus.ok();
   }

}

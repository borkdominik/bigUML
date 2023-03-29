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

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.features.label_edit.BaseLabelEditValidator;

public class PropertyLabelEditValidator extends BaseLabelEditValidator<Property> {

   @Override
   protected ValidationStatus validateLabelEdit(final String label, final GModelElement source,
      final Property element) {

      if (label.isBlank() && element.getAssociation() == null) {
         return ValidationStatus.error("Blank values are not allowed.");
      }

      if (matches(source, UmlClass_Property.Label.multiplicityTypeId(),
         PropertyMultiplicityLabelSuffix.SUFFIX) && !MultiplicityUtil.matches(label)) {
         return ValidationStatus.error("Invalid multiplicity provided. Example: 1..2, 3..*, 5");
      }

      return ValidationStatus.ok();
   }

}

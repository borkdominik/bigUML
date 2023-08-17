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
package com.eclipsesource.uml.glsp.uml.elements.property.features;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration.Label;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.features.label_edit.BaseLabelEditValidator;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;

public class PropertyLabelEditValidator extends BaseLabelEditValidator<Property> {

   @Override
   protected ValidationStatus validateLabelEdit(final String label, final GModelElement source,
      final Property element) {

      if (label.isBlank() && element.getAssociation() == null) {
         return ValidationStatus.error("Blank values are not allowed.");
      }

      if (matches(source, PropertyConfiguration.Label.multiplicityTypeId(),
         PropertyMultiplicityLabelSuffix.SUFFIX) && !MultiplicityUtil.matches(label)) {
         return ValidationStatus.error("Invalid multiplicity provided. Example: 1..2, 3..*, 5");
      }

      return ValidationStatus.ok();
   }

}

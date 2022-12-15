/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.uml2.uml.Property;

public class PropertyMatcher {
   public static Optional<Property> ofOwnedAttributeTypeUsage(final Setting setting, final EObject interest) {
      var eObject = setting.getEObject();

      if (eObject instanceof Property
         && interest.equals(((Property) eObject).getType())) {
         return Optional.of((Property) eObject);
      }

      return Optional.empty();
   }

   public static Optional<Property> ofOwnedEndUsage(final Setting setting, final EObject interest) {
      var eObject = setting.getEObject();

      if (eObject instanceof Property
         && ((Property) eObject).getAssociation() != null) {
         return Optional.of((Property) eObject);
      }

      return Optional.empty();
   }
}

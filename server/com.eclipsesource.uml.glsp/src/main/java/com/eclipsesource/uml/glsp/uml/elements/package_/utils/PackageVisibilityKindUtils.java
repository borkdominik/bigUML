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
package com.eclipsesource.uml.glsp.uml.elements.package_.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;
import com.eclipsesource.uml.modelserver.uml.elements.package_.utils.PackageUtils;

public class PackageVisibilityKindUtils {

   public static String visiblityToLabel(final VisibilityKind visibility) {
      PackageUtils.validateVisiblity(visibility);
      if (visibility == VisibilityKind.PUBLIC_LITERAL) {
         return "<<import>>";
      }
      if (visibility == VisibilityKind.PRIVATE_LITERAL) {
         return "<<access>>";
      }
      return "<<" + visibility.getLiteral() + ">>";
   }

   public static List<ElementChoicePropertyItem.Choice> getVisibilityChoices() {
      return PackageUtils.VALID_VISIBILITIES.stream()
         .map(v -> new ElementChoicePropertyItem.Choice.Builder(v.getLiteral(), v.getLiteral()).build())
         .collect(Collectors.toList());
   }

}

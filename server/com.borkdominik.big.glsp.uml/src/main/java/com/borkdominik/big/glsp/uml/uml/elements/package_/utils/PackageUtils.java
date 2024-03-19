/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.package_.utils;

import java.util.List;

import org.eclipse.uml2.uml.VisibilityKind;

public class PackageUtils {

   public static final List<VisibilityKind> VALID_VISIBILITIES = List.of(VisibilityKind.PUBLIC_LITERAL,
      VisibilityKind.PRIVATE_LITERAL);

   public static void validateVisiblity(final VisibilityKind visibility) {
      if (visibility != null && !VALID_VISIBILITIES.contains(visibility)) {
         throw new RuntimeException("Imports in packages can only be public or private.");
      }
   }
}

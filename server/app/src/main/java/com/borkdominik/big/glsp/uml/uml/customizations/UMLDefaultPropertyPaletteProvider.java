/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.customizations;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.uml2.uml.NamedElement;

import com.borkdominik.big.glsp.server.features.property_palette.provider.BGDefaultPropertyPaletteProvider;

public class UMLDefaultPropertyPaletteProvider extends BGDefaultPropertyPaletteProvider {

   @Override
   protected String getLabel(final EObject element) {
      if (element instanceof NamedElement ne && ne.getName() != null && !ne.getName().isBlank()) {
         return ne.getName();
      }
      return super.getLabel(element);
   }
}

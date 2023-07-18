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
package com.eclipsesource.uml.glsp.features.outline.generator;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.uml2.uml.Element;

public class NotationBasedOutlineGenerator extends BaseOutlineGenerator implements DefaultDiagramOutlineGenerator {

   @Override
   protected boolean filter(final EObject eObject) {
      return super.filter(eObject) && modelState.hasNotation(eObject);
   }

   @Override
   protected String iconOf(final Element element) {
      return modelState.getIndex().getNotation(element).map(notation -> {
         if (notation instanceof Edge) {
            return "edge";
         }

         return "element";
      }).orElse("element");
   }
}

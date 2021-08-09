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
package com.eclipsesource.uml.modelserver;

import com.eclipsesource.uml.modelserver.unotation.Representation;

public final class UmlNotationUtil {

   private UmlNotationUtil() {}

   public static final String NOTATION_EXTENSION = "unotation";

   public static Representation getRepresentation(final String diagramType) {
      switch (diagramType.toLowerCase()) {
         case "activity":
            return Representation.ACTIVITY;
         case "class":
            return Representation.CLASS;
         case "component":
            return Representation.COMPONENT;
         case "deployment":
            return Representation.DEPLOYMENT;
         case "package":
            return Representation.PACKAGE;
         case "sequence":
            return Representation.SEQUENCE;
         case "statemachine":
            return Representation.STATEMACHINE;
         case "usecase":
            return Representation.USECASE;
      }
      return Representation.CLASS;
   }

}

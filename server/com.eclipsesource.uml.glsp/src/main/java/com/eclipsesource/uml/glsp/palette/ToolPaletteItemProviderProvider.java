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
package com.eclipsesource.uml.glsp.palette;

import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class ToolPaletteItemProviderProvider {
   private ToolPaletteItemProviderProvider() {}

   public static ToolPaletteItemProvider get(final UmlModelState modelState) {
      Representation diagramType = modelState.getNotationModel().getDiagramType();
      switch (diagramType) {
         case COMMUNICATION: {
            return new UmlCommunicationToolPaletteItemProvider();
         }
      }
      return null;
   }
}

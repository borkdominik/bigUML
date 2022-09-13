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

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface UmlDiagramPaletteItemProvider {
   boolean supports(Representation representation);

   List<PaletteItem> getItems(Map<String, String> args);
}

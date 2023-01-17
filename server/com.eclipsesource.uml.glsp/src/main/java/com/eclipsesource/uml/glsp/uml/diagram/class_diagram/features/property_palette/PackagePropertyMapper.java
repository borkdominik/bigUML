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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.property_palette;

import java.util.List;

import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementTextPropertyItem;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClassPackage;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;

public class PackagePropertyMapper extends BaseDiagramElementPropertyMapper<Package> {

   @Override
   public List<ElementPropertyItem> map(final Package source) {
      var elementId = idGenerator.getOrCreateId(source);

      return List.of(
         new ElementTextPropertyItem(elementId, UmlClassPackage.Property.NAME, source.getName()),
         new ElementTextPropertyItem(elementId, UmlClassPackage.Property.LABEL, source.getLabel()));
   }

}

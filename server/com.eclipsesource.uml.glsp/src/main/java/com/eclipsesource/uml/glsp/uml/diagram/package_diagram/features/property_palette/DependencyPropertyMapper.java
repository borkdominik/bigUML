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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.property_palette;

import java.util.Optional;

import org.eclipse.uml2.uml.Dependency;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Dependency;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;

public class DependencyPropertyMapper extends BaseDiagramElementPropertyMapper<Dependency> {

   @Override
   public PropertyPalette map(final Dependency source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlPackage_Dependency.Property.class, elementId).items();

      return new PropertyPalette(elementId, "Dependency", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      // var property = getProperty(UmlPackage_Dependency.Property.class, action);
      // var handler = getHandler(UpdateDependencyHandler.class, action);
      UpdateOperation operation = null;
      return withContext(operation);
   }

}

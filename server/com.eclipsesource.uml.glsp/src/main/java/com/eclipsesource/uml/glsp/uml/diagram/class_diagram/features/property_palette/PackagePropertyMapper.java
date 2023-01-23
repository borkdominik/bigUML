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
import java.util.Optional;

import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyBuilder;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.UpdateElementPropertyOperationBuilder;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClassPackage;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.UpdatePackageNameHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;

public class PackagePropertyMapper extends BaseDiagramElementPropertyMapper<Package> {

   @Override
   public List<ElementPropertyItem> map(final Package source) {
      var elementId = idGenerator.getOrCreateId(source);

      return new ElementPropertyBuilder(elementId)
         .textProperty(UmlClassPackage.Property.NAME, source.getName())
         .items();
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      return new UpdateElementPropertyOperationBuilder()
         .operation(UmlClassPackage.Property.NAME,
            (a) -> new UpdatePackageNameHandler().asOperation(
               a.getElementId(),
               new UpdatePackageNameHandler.Args(a.getValue())))
         .find(action);
   }

}

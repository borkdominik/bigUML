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

import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Package;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.UpdatePackageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.upackage.UpdatePackageNameHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage.UpdatePackageArgument;

public class PackagePropertyMapper extends BaseDiagramElementPropertyMapper<Package> {

   @Override
   public PropertyPalette map(final Package source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = propertyBuilder(elementId)
         .text(UmlClass_Package.Property.NAME, "Name", source.getName())
         .text(UmlClass_Package.Property.URI, "Uri", source.getURI())
         .choice(
            UmlClass_Package.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKind.VALUES.stream().map(v -> v.getLiteral()).collect(Collectors.toList()),
            source.getVisibility().getLiteral())

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      return operationBuilder()
         .map(UmlClass_Package.Property.NAME,
            (element, op) -> handlerMapper.asOperation(
               UpdatePackageNameHandler.class,
               element,
               new UpdatePackageNameHandler.Args(op.getValue())))
         .map(UmlClass_Package.Property.URI,
            (element, op) -> handlerMapper.asOperation(
               UpdatePackageHandler.class,
               element,
               new UpdatePackageArgument.Builder()
                  .uri(op.getValue())
                  .build()))
         .map(UmlClass_Package.Property.VISIBILITY_KIND,
            (element, op) -> handlerMapper.asOperation(
               UpdatePackageHandler.class,
               element,
               new UpdatePackageArgument.Builder()
                  .visibilityKind(VisibilityKind.get(op.getValue()))
                  .build()))

         .find(action);
   }

}

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

import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.UpdateOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.UpdateOperationNameHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation.UpdateOperationArgument;

public class OperationPropertyMapper extends BaseDiagramElementPropertyMapper<Operation> {

   @Override
   public PropertyPalette map(final Operation source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = propertyBuilder(elementId)
         .text(UmlClass_Operation.Property.NAME, "Name", source.getName())
         .bool(UmlClass_Operation.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .bool(UmlClass_Operation.Property.IS_STATIC, "Is static", source.isStatic())
         .bool(UmlClass_Operation.Property.IS_QUERY, "Is query", source.isQuery())
         .choice(
            UmlClass_Operation.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKind.VALUES.stream().map(v -> v.getLiteral()).collect(Collectors.toList()),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      return operationBuilder()
         .map(UmlClass_Operation.Property.NAME,
            (element, op) -> handlerMapper.asOperation(
               UpdateOperationNameHandler.class,
               element,
               new UpdateOperationNameHandler.Args(op.getValue())))
         .map(UmlClass_Operation.Property.IS_ABSTRACT,
            (element, op) -> handlerMapper.asOperation(
               UpdateOperationHandler.class,
               element,
               new UpdateOperationArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Operation.Property.IS_STATIC,
            (element, op) -> handlerMapper.asOperation(
               UpdateOperationHandler.class,
               element,
               new UpdateOperationArgument.Builder()
                  .isStatic(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Operation.Property.IS_QUERY,
            (element, op) -> handlerMapper.asOperation(
               UpdateOperationHandler.class,
               element,
               new UpdateOperationArgument.Builder()
                  .isQuery(Boolean.parseBoolean(op.getValue()))
                  .build()))
         .map(UmlClass_Operation.Property.VISIBILITY_KIND,
            (element, op) -> handlerMapper.asOperation(
               UpdateOperationHandler.class,
               element,
               new UpdateOperationArgument.Builder()
                  .visibilityKind(VisibilityKind.get(op.getValue()))
                  .build()))
         .find(action);
   }

}

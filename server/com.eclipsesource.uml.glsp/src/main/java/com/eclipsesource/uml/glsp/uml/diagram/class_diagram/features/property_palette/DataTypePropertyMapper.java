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

import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_DataType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.data_type.UpdateDataTypeHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.OperationUtils;
import com.eclipsesource.uml.glsp.uml.utils.PropertyUtils;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type.UpdateDataTypeArgument;

public class DataTypePropertyMapper extends BaseDiagramElementPropertyMapper<DataType> {

   @Override
   public PropertyPalette map(final DataType source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlClass_DataType.Property.class, elementId)
         .text(UmlClass_DataType.Property.NAME, "Name", source.getName())
         .bool(UmlClass_DataType.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .choice(
            UmlClass_DataType.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(
            UmlClass_DataType.Property.OWNED_ATTRIBUTES,
            "Owned Attribute",
            PropertyUtils.asReferences(source.getOwnedAttributes(), idGenerator),
            List.of(
               new ElementReferencePropertyItem.CreateReference("Property",
                  new CreateNodeOperation(UmlClass_Property.TYPE_ID, elementId))))
         .reference(
            UmlClass_DataType.Property.OWNED_ATTRIBUTES,
            "Owned Operation",
            OperationUtils.asReferences(source.getOwnedOperations(), idGenerator),
            List.of(
               new ElementReferencePropertyItem.CreateReference("Operation",
                  new CreateNodeOperation(UmlClass_Operation.TYPE_ID, elementId))))

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlClass_DataType.Property.class, action);
      var handler = getHandler(UpdateDataTypeHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateDataTypeArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               new UpdateDataTypeArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateDataTypeArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}

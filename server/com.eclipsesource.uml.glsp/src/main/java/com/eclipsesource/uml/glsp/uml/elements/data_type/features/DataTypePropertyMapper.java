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
package com.eclipsesource.uml.glsp.uml.elements.data_type.features;

import java.util.Optional;

import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.data_type.DataTypeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.data_type.DataTypeOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.operation.utils.OperationPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.elements.property.utils.PropertyPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.data_type.commands.UpdateDataTypeArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class DataTypePropertyMapper extends RepresentationElementPropertyMapper<DataType> {

   @Inject
   public DataTypePropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final DataType source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(DataTypeConfiguration.Property.class, elementId)
         .text(DataTypeConfiguration.Property.NAME, "Name", source.getName())
         .bool(DataTypeConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .choice(
            DataTypeConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(PropertyPropertyPaletteUtils.asReference(this, elementId,
            DataTypeConfiguration.Property.OWNED_ATTRIBUTES, "Owned Attribute", source.getOwnedAttributes()))
         .reference(OperationPropertyPaletteUtils.asReference(this, elementId,
            DataTypeConfiguration.Property.OWNED_OPERATIONS, "Owned Operation", source.getOwnedOperations()))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(DataTypeConfiguration.Property.class, action);
      var handler = getHandler(DataTypeOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateDataTypeArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateDataTypeArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateDataTypeArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);

   }

}

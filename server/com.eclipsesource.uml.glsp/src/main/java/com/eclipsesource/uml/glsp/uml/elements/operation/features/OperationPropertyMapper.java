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
package com.eclipsesource.uml.glsp.uml.elements.operation.features;

import java.util.ArrayList;
import java.util.Optional;

import org.eclipse.uml2.uml.CallConcurrencyKind;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.operation.OperationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.operation.OperationOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.parameter.utils.ParameterPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.CallConcurrencyKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.shared.model.NewListIndex;
import com.eclipsesource.uml.modelserver.uml.elements.operation.commands.UpdateOperationArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.reflect.TypeToken;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class OperationPropertyMapper extends RepresentationElementPropertyMapper<Operation> {

   @Inject
   public OperationPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Operation source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(OperationConfiguration.Property.class, elementId)
         .text(OperationConfiguration.Property.NAME, "Name", source.getName())
         .bool(OperationConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .bool(OperationConfiguration.Property.IS_STATIC, "Is static", source.isStatic())
         .bool(OperationConfiguration.Property.IS_QUERY, "Is query", source.isQuery())
         .choice(
            OperationConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .choice(
            OperationConfiguration.Property.CONCURRENCY,
            "Concurrency",
            CallConcurrencyKindUtils.asChoices(),
            source.getConcurrency().getLiteral())
         .reference(ParameterPropertyPaletteUtils.asReference(this, elementId,
            OperationConfiguration.Property.OWNED_PARAMETERS, "Owned Parameters", source.getOwnedParameters()))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(OperationConfiguration.Property.class, action);
      var handler = getHandler(OperationOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateOperationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateOperationArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_STATIC:
            operation = handler.withArgument(
               UpdateOperationArgument.by()
                  .isStatic(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case IS_QUERY:
            operation = handler.withArgument(
               UpdateOperationArgument.by()
                  .isQuery(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateOperationArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
         case CONCURRENCY:
            operation = handler.withArgument(
               UpdateOperationArgument.by()
                  .concurrency(CallConcurrencyKind.get(action.getValue()))
                  .build());
            break;
         case OWNED_PARAMETERS_INDEX:
            operation = handler.withArgument(
               UpdateOperationArgument.by()
                  .parameterIndex(
                     gson.fromJson(action.getValue(), new TypeToken<ArrayList<NewListIndex>>() {}.getType()))
                  .build());
            break;
      }

      return withContext(operation);

   }

}

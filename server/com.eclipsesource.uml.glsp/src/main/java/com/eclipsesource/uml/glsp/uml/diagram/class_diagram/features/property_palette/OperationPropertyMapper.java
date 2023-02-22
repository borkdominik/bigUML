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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.CallConcurrencyKind;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Parameter;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.operation.UpdateOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.CallConcurrencyKindUtils;
import com.eclipsesource.uml.glsp.uml.utils.ParameterUtils;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.shared.model.OrderPosition;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation.UpdateOperationArgument;
import com.google.common.reflect.TypeToken;

public class OperationPropertyMapper extends BaseDiagramElementPropertyMapper<Operation> {

   @Override
   public PropertyPalette map(final Operation source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlClass_Operation.Property.class, elementId)
         .text(UmlClass_Operation.Property.NAME, "Name", source.getName())
         .bool(UmlClass_Operation.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .bool(UmlClass_Operation.Property.IS_STATIC, "Is static", source.isStatic())
         .bool(UmlClass_Operation.Property.IS_QUERY, "Is query", source.isQuery())
         .choice(
            UmlClass_Operation.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .choice(
            UmlClass_Operation.Property.CONCURRENCY,
            "Concurrency",
            CallConcurrencyKindUtils.asChoices(),
            source.getConcurrency().getLiteral())
         .reference(
            UmlClass_Operation.Property.OWNED_PARAMETERS,
            "Owned Parameters",
            ParameterUtils.asReferences(source.getOwnedParameters(), idGenerator),
            List.of(
               new ElementReferencePropertyItem.CreateReference("Parameter",
                  new CreateNodeOperation(UmlClass_Parameter.TYPE_ID, elementId))),
            true)

         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlClass_Operation.Property.class, action);
      var handler = getHandler(UpdateOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateOperationArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               new UpdateOperationArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_STATIC:
            operation = handler.withArgument(
               new UpdateOperationArgument.Builder()
                  .isStatic(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_QUERY:
            operation = handler.withArgument(
               new UpdateOperationArgument.Builder()
                  .isQuery(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateOperationArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
         case CONCURRENCY:
            operation = handler.withArgument(
               new UpdateOperationArgument.Builder()
                  .concurrency(CallConcurrencyKind.get(action.getValue()))
                  .get());
            break;
         case OWNED_PARAMETERS_ORDER:
            operation = handler.withArgument(
               new UpdateOperationArgument.Builder()
                  .parameterOrders(
                     gson.fromJson(action.getValue(), new TypeToken<ArrayList<OrderPosition>>() {}.getType()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}

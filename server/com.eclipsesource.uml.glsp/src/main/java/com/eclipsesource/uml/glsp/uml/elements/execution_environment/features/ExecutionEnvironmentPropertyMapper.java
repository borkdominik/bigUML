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
package com.eclipsesource.uml.glsp.uml.elements.execution_environment.features;

import java.util.Optional;

import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.execution_environment.ExecutionEnvironmentConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.execution_environment.ExecutionEnvironmentOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.execution_environment.commands.UpdateExecutionEnvironmentArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ExecutionEnvironmentPropertyMapper extends RepresentationElementPropertyMapper<ExecutionEnvironment> {

   @Inject
   public ExecutionEnvironmentPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final ExecutionEnvironment source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ExecutionEnvironmentConfiguration.Property.class, elementId)
         .text(ExecutionEnvironmentConfiguration.Property.NAME, "Name", source.getName())
         .bool(ExecutionEnvironmentConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .bool(ExecutionEnvironmentConfiguration.Property.IS_ACTIVE, "Is active", source.isActive())
         .choice(ExecutionEnvironmentConfiguration.Property.VISIBILITY_KIND, "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ExecutionEnvironmentConfiguration.Property.class, action);
      var handler = getHandler(ExecutionEnvironmentOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateExecutionEnvironmentArgument.by()
                  .name(action.getValue())
                  .build());
            break;

         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateExecutionEnvironmentArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;

         case IS_ACTIVE:
            operation = handler.withArgument(
               UpdateExecutionEnvironmentArgument.by()
                  .isActive(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;

         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateExecutionEnvironmentArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);

   }

}

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
package com.eclipsesource.uml.glsp.uml.elements.deployment_specification.features;

import java.util.Optional;

import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.deployment_specification.DeploymentSpecificationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.deployment_specification.DeploymentSpecificationOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.operation.utils.OperationPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.elements.property.utils.PropertyPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.deployment_specification.commands.UpdateDeploymentSpecificationArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class DeploymentSpecificationPropertyMapper
   extends RepresentationElementPropertyMapper<DeploymentSpecification> {

   @Inject
   public DeploymentSpecificationPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final DeploymentSpecification source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(DeploymentSpecificationConfiguration.Property.class, elementId)
         .text(DeploymentSpecificationConfiguration.Property.NAME, "Name", source.getName())
         .text(DeploymentSpecificationConfiguration.Property.FILE_NAME, "File name", source.getFileName())
         .text(DeploymentSpecificationConfiguration.Property.DEPLOYMENT_LOCATION, "Deployment location",
            source.getDeploymentLocation())
         .text(DeploymentSpecificationConfiguration.Property.EXECUTION_LOCATION, "Execution location",
            source.getExecutionLocation())
         .bool(DeploymentSpecificationConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .choice(
            DeploymentSpecificationConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(PropertyPropertyPaletteUtils.asReference(this, elementId,
            DeploymentSpecificationConfiguration.Property.OWNED_ATTRIBUTES, "Owned Attribute",
            source.getOwnedAttributes()))
         .reference(OperationPropertyPaletteUtils.asReference(this, elementId,
            DeploymentSpecificationConfiguration.Property.OWNED_OPERATIONS, "Owned Operation",
            source.getOwnedOperations()))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {

      var property = getProperty(DeploymentSpecificationConfiguration.Property.class, action);
      var handler = getHandler(DeploymentSpecificationOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateDeploymentSpecificationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case FILE_NAME:
            operation = handler.withArgument(
               UpdateDeploymentSpecificationArgument.by()
                  .fileName(action.getValue())
                  .build());
            break;

         case DEPLOYMENT_LOCATION:
            operation = handler.withArgument(
               UpdateDeploymentSpecificationArgument.by()
                  .deploymentLocation(action.getValue())
                  .build());
            break;

         case EXECUTION_LOCATION:
            operation = handler.withArgument(
               UpdateDeploymentSpecificationArgument.by()
                  .executionLocation(action.getValue())
                  .build());
            break;

         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateDeploymentSpecificationArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateDeploymentSpecificationArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);

   }
}

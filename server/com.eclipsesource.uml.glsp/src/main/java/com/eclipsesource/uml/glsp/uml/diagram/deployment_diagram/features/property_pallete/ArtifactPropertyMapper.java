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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.features.property_pallete;

import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Artifact;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Property;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.handler.operation.artifact.UpdateArtifactHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.OperationUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.PropertyUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.artifact.UpdateArtifactArgument;

public class ArtifactPropertyMapper extends BaseDiagramElementPropertyMapper<Artifact> {

   @Override
   public PropertyPalette map(final Artifact source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlDeployment_Artifact.Property.class, elementId)
         .text(UmlDeployment_Artifact.Property.NAME, "Name", source.getName())
         .text(UmlDeployment_Artifact.Property.FILE_NAME, "File name", source.getFileName())
         .bool(UmlDeployment_Artifact.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .choice(
            UmlDeployment_Artifact.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .reference(
            UmlDeployment_Artifact.Property.OWNED_ATTRIBUTES,
            "Owned Attribute",
            PropertyUtils.asReferences(source.getOwnedAttributes(), idGenerator),
            List.of(
               new ElementReferencePropertyItem.CreateReference("Property",
                  new CreateNodeOperation(UmlDeployment_Property.typeId(), elementId))))
         .reference(
            UmlDeployment_Artifact.Property.OWNED_ATTRIBUTES,
            "Owned Operation",
            OperationUtils.asReferences(source.getOwnedOperations(), idGenerator),
            List.of(
               new ElementReferencePropertyItem.CreateReference("Operation",
                  new CreateNodeOperation(UmlDeployment_Operation.typeId(), elementId))))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlDeployment_Artifact.Property.class, action);
      var handler = getHandler(UpdateArtifactHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateArtifactArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case FILE_NAME:
            operation = handler.withArgument(
               new UpdateArtifactArgument.Builder()
                  .fileName(action.getValue())
                  .get());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               new UpdateArtifactArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateArtifactArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}

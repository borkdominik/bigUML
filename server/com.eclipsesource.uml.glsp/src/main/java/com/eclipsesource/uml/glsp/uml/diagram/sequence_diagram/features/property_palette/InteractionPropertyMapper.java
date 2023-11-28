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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette;

import java.util.Optional;

import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Interaction;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction.UpdateInteractionHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction.UpdateInteractionArgument;

public class InteractionPropertyMapper extends BaseDiagramElementPropertyMapper<Interaction> {

   @Override
   public PropertyPalette map(final Interaction source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlSequence_Interaction.Property.class, elementId)
         .text(UmlSequence_Interaction.Property.NAME, "Name", source.getName(), false)
         .bool(UmlSequence_Interaction.Property.IS_ABSTRACT, "Is abstract", source.isAbstract(), false)
         .bool(UmlSequence_Interaction.Property.IS_ACTIVE, "Is active", source.isActive(), false)
         .choice(
            UmlSequence_Interaction.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral(), false)
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlSequence_Interaction.Property.class, action);
      var handler = getHandler(UpdateInteractionHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateInteractionArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               new UpdateInteractionArgument.Builder()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case IS_ACTIVE:
            operation = handler.withArgument(
               new UpdateInteractionArgument.Builder()
                  .isActive(Boolean.parseBoolean(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateInteractionArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}

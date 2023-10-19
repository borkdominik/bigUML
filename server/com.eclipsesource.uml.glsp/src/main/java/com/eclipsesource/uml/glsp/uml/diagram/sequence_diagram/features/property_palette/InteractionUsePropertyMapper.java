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

import org.eclipse.uml2.uml.InteractionUse;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionUse;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_use.UpdateInteractionUseHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_use.UpdateInteractionUseArgument;

public class InteractionUsePropertyMapper extends BaseDiagramElementPropertyMapper<InteractionUse> {

   @Override
   public PropertyPalette map(final InteractionUse source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlSequence_InteractionUse.Property.class, elementId)
         .text(UmlSequence_InteractionUse.Property.NAME, "Name", source.getName(), false)
         .text(UmlSequence_InteractionUse.Property.INTERACTION_REFERENCE, "ref", reference(source), false)
         .choice(
            UmlSequence_InteractionUse.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral(), false)

         // .reference(
         // UmlSequence_InteractionUse.Property.INTERACTION_REFERENCE,
         // "Interaction",
         // PropertyUtils.asReferences(source.getRefersTo(), idGenerator))

         // .reference(UmlSequence_InteractionUse.Property.INTERACTION_REFERENCE, "Reference",
         // source.eContainer().eContainer().eContents().stream().filter(o -> o instanceof Interaction))
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   private String reference(final InteractionUse source) {
      if (source.getRefersTo() != null) {
         source.getRefersTo().getName();
      }
      return "";
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlSequence_InteractionUse.Property.class, action);
      var handler = getHandler(UpdateInteractionUseHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateInteractionUseArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateInteractionUseArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
         case INTERACTION_REFERENCE:
            operation = handler.withArgument(
               new UpdateInteractionUseArgument.Builder()
                  .reference(action.getValue())
                  .get());
            break;
      }

      return withContext(operation);

   }

}

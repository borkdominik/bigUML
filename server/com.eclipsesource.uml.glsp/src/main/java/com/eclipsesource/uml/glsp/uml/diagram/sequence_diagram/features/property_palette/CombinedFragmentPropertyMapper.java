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

import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.InteractionOperatorKind;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_CombinedFragment;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.combined_fragment.UpdateCombinedFragmentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.utils.InteractionOperatorTypeUtil;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.combined_fragment.UpdateCombinedFragmentArgument;

public class CombinedFragmentPropertyMapper extends BaseDiagramElementPropertyMapper<CombinedFragment> {

   @Override
   public PropertyPalette map(final CombinedFragment source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlSequence_CombinedFragment.Property.class, elementId)
         .text(UmlSequence_CombinedFragment.Property.NAME, "Name", source.getName(), false)
         .choice(
            UmlSequence_CombinedFragment.Property.INTERACTION_OPERATOR_KIND,
            "Interaction Operator",
            InteractionOperatorTypeUtil.asChoices(),
            source.getInteractionOperator().getLiteral(), false)
         .choice(
            UmlSequence_CombinedFragment.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral(), false)
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlSequence_CombinedFragment.Property.class, action);
      var handler = getHandler(UpdateCombinedFragmentHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateCombinedFragmentArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case INTERACTION_OPERATOR_KIND:
            operation = handler.withArgument(
               new UpdateCombinedFragmentArgument.Builder()
                  .interactioOperatorKind(InteractionOperatorKind.get(action.getValue()))
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateCombinedFragmentArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);

   }

}

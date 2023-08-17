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
package com.eclipsesource.uml.glsp.uml.elements.interface_realization.features;

import java.util.Optional;

import org.eclipse.uml2.uml.InterfaceRealization;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.interface_realization.InterfaceRealizationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.interface_realization.InterfaceRealizationOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.interface_realization.commands.UpdateInterfaceRealizationArgument;

public class InterfaceRealizationPropertyMapper extends BaseDiagramElementPropertyMapper<InterfaceRealization> {

   @Override
   public PropertyPalette map(final InterfaceRealization source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(InterfaceRealizationConfiguration.Property.class, elementId)
         .text(InterfaceRealizationConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            InterfaceRealizationConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, "InterfaceRealization", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(InterfaceRealizationConfiguration.Property.class, action);
      var handler = getHandler(InterfaceRealizationOperationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateInterfaceRealizationArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateInterfaceRealizationArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }

}

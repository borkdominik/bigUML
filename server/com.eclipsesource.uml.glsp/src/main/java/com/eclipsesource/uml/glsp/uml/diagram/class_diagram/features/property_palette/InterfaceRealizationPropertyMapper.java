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

import java.util.Optional;

import org.eclipse.uml2.uml.InterfaceRealization;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_InterfaceRealization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.interface_realization.UpdateInterfaceRealizationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.BaseDiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.interface_realization.UpdateInterfaceRealizationArgument;

public class InterfaceRealizationPropertyMapper extends BaseDiagramElementPropertyMapper<InterfaceRealization> {

   @Override
   public PropertyPalette map(final InterfaceRealization source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(UmlClass_InterfaceRealization.Property.class, elementId)
         .text(UmlClass_InterfaceRealization.Property.NAME, "Name", source.getName())
         .choice(
            UmlClass_InterfaceRealization.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, "InterfaceRealization", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(UmlClass_InterfaceRealization.Property.class, action);
      var handler = getHandler(UpdateInterfaceRealizationHandler.class, action);
      UpdateOperation operation = null;

      switch (property) {
         case NAME:
            operation = handler.withArgument(
               new UpdateInterfaceRealizationArgument.Builder()
                  .name(action.getValue())
                  .get());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               new UpdateInterfaceRealizationArgument.Builder()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .get());
            break;
      }

      return withContext(operation);
   }

}
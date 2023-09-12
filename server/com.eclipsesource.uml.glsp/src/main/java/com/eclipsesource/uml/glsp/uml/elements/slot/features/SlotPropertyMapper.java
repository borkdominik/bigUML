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
package com.eclipsesource.uml.glsp.uml.elements.slot.features;

import java.util.Optional;

import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Slot;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.slot.SlotConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.slot.SlotOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.slot.utils.SlotPropertyPaletteUtils;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.modelserver.uml.elements.slot.commands.UpdateSlotArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class SlotPropertyMapper extends RepresentationElementPropertyMapper<Slot> {

   @Inject
   public SlotPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Slot source) {

      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(SlotConfiguration.Property.class, elementId)
         .choice(
            SlotPropertyPaletteUtils.definingFeatures(this, source, SlotConfiguration.Property.DEFINING_FEATURE,
               "Defining Feature"))
         .reference(SlotPropertyPaletteUtils.specifications(this, source, SlotConfiguration.Property.VALUES, "Values"))
         .items();

      return new PropertyPalette(elementId, "Slot", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(SlotConfiguration.Property.class, action);
      var handler = getHandler(SlotOperationHandler.class, action);

      UpdateOperation operation = null;

      switch (property) {
         case DEFINING_FEATURE:
            operation = handler.withArgument(
               UpdateSlotArgument.by()
                  .definingFeatureId(action.getValue())
                  .build());
            break;
      }

      return withContext(operation);
   }

   public static Property convertToProperty(final NamedElement existingElement) {
      if (existingElement instanceof Property) {
         return (Property) existingElement;
      }

      return null;
   }
}

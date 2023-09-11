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

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Slot;
import org.eclipse.uml2.uml.ValueSpecification;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.slot.SlotConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.slot.SlotOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.ClassifierUtils;
import com.eclipsesource.uml.glsp.uml.utils.element.SlotUtils;
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
      var rootId = modelState.getIndex().getRoot().getId();
      var root = getOrThrow(modelState.getIndex().getEObject(rootId), Model.class, null);
      var objects = root.allOwnedElements();
      var properties = ClassifierUtils.extractUMLProperties(objects);
      var defFeature = source.getDefiningFeature();
      var valueList = source.getValues();
      List<String> finalList = new ArrayList<>();
      String definingFeature;

      if (defFeature != null) {
         definingFeature = defFeature.toString();
      } else {
         definingFeature = "Empty";
      }

      if (!valueList.isEmpty()) {
         for (ValueSpecification val : valueList) {
            finalList.add("name: " + val.getName().toString() + "  value: " + val.stringValue());
         }
      }
      var items = this.propertyBuilder(SlotConfiguration.Property.class, elementId)
         .choice(
            SlotConfiguration.Property.DEFINING_FEATURE,
            "Defining Feature",
            ClassifierUtils.propsAsChoices(properties),
            definingFeature)
         .text(SlotConfiguration.Property.VALUE, "Value", "")
         .referenceNoCreate(
            SlotConfiguration.Property.VALUE,
            "Owned Values",
            SlotUtils.asReferences(source.getValues(), idGenerator))
         .items();

      return new PropertyPalette(elementId, "Slot", items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(SlotConfiguration.Property.class, action);
      var handler = getHandler(SlotOperationHandler.class, action);

      var rootId = modelState.getIndex().getRoot().getId();
      var root = getOrThrow(modelState.getIndex().getEObject(rootId), Model.class, null);
      var objects = root.allOwnedElements();
      var properties = ClassifierUtils.extractUMLProperties(objects);
      Property chosenProperty = ClassifierUtils.getProperty(properties, action.getValue());

      UpdateOperation operation = null;

      switch (property) {
         case DEFINING_FEATURE:
            operation = handler.withArgument(
               UpdateSlotArgument.by()
                  .definingFeature(chosenProperty, idGenerator)
                  .build());
            break;
         case VALUE:

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

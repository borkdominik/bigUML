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
package com.eclipsesource.uml.glsp.uml.elements.slot.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.LiteralSpecification;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Slot;
import org.eclipse.uml2.uml.ValueSpecification;

import com.eclipsesource.uml.glsp.core.handler.operation.delete.UmlDeleteOperation;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.uml.elements.literal_specification.LiteralSpecificationConfiguration;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;

public class SlotPropertyPaletteUtils {
   public static ElementReferencePropertyItem asReference(final RepresentationElementPropertyMapper<?> mapper,
      final String elementId,
      final Enum<?> propertyId,
      final String label, final List<Slot> slots) {
      return new ElementReferencePropertyItem.Builder(elementId, propertyId.name())
         .label(label)
         .references(asReferences(slots, mapper.getIdGenerator()))
         .creates(List.of(
            new ElementReferencePropertyItem.CreateReference.Builder(
               "Slot",
               new CreateNodeOperation(mapper.configurationFor(Slot.class).typeId(),
                  elementId))
                     .build()))
         .build();
   }

   protected static List<ElementReferencePropertyItem.Reference> asReferences(
      final List<Slot> slots,
      final EMFIdGenerator idGenerator) {
      var references = slots.stream()
         .map(v -> {
            var id = idGenerator.getOrCreateId(v);
            var property = v.getDefiningFeature();
            var values = v.getValues().stream().map(va -> va.stringValue()).collect(Collectors.toList());
            var label = String.format("%s%s", property == null ? "" : property.getName() + "=", values);
            return new ElementReferencePropertyItem.Reference.Builder(id, label)
               .deleteActions(List.of(new UmlDeleteOperation(List.of(id))))
               .build();
         })
         .collect(Collectors.toList());

      return references;
   }

   public static ElementReferencePropertyItem specifications(final RepresentationElementPropertyMapper<?> mapper,
      final Slot slot, final Enum<?> propertyId,
      final String label) {
      var elementId = mapper.getIdGenerator().getOrCreateId(slot);

      return new ElementReferencePropertyItem.Builder(elementId, propertyId.name())
         .label(label)
         .references(specificationsAsReferences(slot.getValues(), mapper.getIdGenerator()))
         .creates(List.of(
            new ElementReferencePropertyItem.CreateReference.Builder(
               "LiteralBoolean",
               new CreateNodeOperation(
                  mapper.configurationFor(LiteralSpecification.class, LiteralSpecificationConfiguration.class)
                     .literalBooleanTypeId(),
                  elementId))
                     .build(),

            new ElementReferencePropertyItem.CreateReference.Builder(
               "LiteralString",
               new CreateNodeOperation(
                  mapper.configurationFor(LiteralSpecification.class, LiteralSpecificationConfiguration.class)
                     .literalStringTypeId(),
                  elementId))
                     .build(),

            new ElementReferencePropertyItem.CreateReference.Builder(
               "LiteralInteger",
               new CreateNodeOperation(
                  mapper.configurationFor(LiteralSpecification.class, LiteralSpecificationConfiguration.class)
                     .literalIntegerTypeId(),
                  elementId))
                     .build()))
         .build();
   }

   protected static List<ElementReferencePropertyItem.Reference> specificationsAsReferences(
      final List<ValueSpecification> properties,
      final EMFIdGenerator idGenerator) {
      var references = properties.stream()
         .map(v -> {
            var value = v.stringValue();
            var label = v.getName() == null ? value : String.format("%s=%s", v.getName(), value);
            var id = idGenerator.getOrCreateId(v);
            return new ElementReferencePropertyItem.Reference.Builder(id,
               label)
                  .deleteActions(List.of(new UmlDeleteOperation(List.of(id))))
                  .build();
         })
         .collect(Collectors.toList());

      return references;
   }

   public static ElementChoicePropertyItem definingFeatures(final RepresentationElementPropertyMapper<?> mapper,
      final Slot slot, final Enum<?> propertyId,
      final String label) {
      var elementId = mapper.getIdGenerator().getOrCreateId(slot);
      var properties = extractUMLProperties(slot);
      return new ElementChoicePropertyItem.Builder(elementId, propertyId.name())
         .label(label)
         .choices(propsAsChoices(properties, mapper.getIdGenerator()))
         .choice(
            slot.getDefiningFeature() != null ? mapper.getIdGenerator().getOrCreateId(slot.getDefiningFeature()) : null)
         .build();
   }

   protected static List<ElementChoicePropertyItem.Choice> propsAsChoices(final List<Property> properties,
      final EMFIdGenerator idGenerator) {
      var choices = new ArrayList<ElementChoicePropertyItem.Choice>();
      choices.add(new ElementChoicePropertyItem.Choice.Builder("<Undefined>", "").build());
      choices.addAll(properties.stream()
         .map(c -> new ElementChoicePropertyItem.Choice.Builder(c.getName(), idGenerator.getOrCreateId(c)).build())
         .collect(Collectors.toList()));

      return choices;
   }

   protected static List<Property> extractUMLProperties(final Slot slot) {
      List<Property> propertyList = new ArrayList<>();
      var umlElements = slot.getModel().allOwnedElements();
      for (Object element : umlElements) {
         if (element instanceof Property) {
            Property umlProperty = (Property) element;
            propertyList.add(umlProperty);
         }
      }

      return propertyList;
   }

}

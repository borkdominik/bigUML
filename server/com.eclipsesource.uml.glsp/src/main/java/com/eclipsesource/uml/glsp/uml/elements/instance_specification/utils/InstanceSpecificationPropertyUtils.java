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
package com.eclipsesource.uml.glsp.uml.elements.instance_specification.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.handler.operation.delete.UmlDeleteOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;

public class InstanceSpecificationPropertyUtils {
   public static ElementReferencePropertyItem classifiers(final RepresentationElementPropertyMapper<?> mapper,
      final InstanceSpecification instance, final Enum<?> propertyId,
      final String label) {
      var elementId = mapper.getIdGenerator().getOrCreateId(instance);

      return new ElementReferencePropertyItem.Builder(elementId, propertyId.name())
         .label(label)
         .references(asReferences(instance, mapper.getIdGenerator()))
         .creates(classifiersAsCreateReferences(mapper, instance, propertyId.name()))
         .isAutocomplete(true)
         .build();
   }

   public static List<ElementReferencePropertyItem.Reference> asReferences(
      final InstanceSpecification instance,
      final EMFIdGenerator idGenerator) {
      var parentId = idGenerator.getOrCreateId(instance);
      var classifiers = instance.getClassifiers();
      var references = classifiers.stream()
         .map(v -> {
            var label = v.getName() == null ? "Classifier" : v.getName();
            var id = idGenerator.getOrCreateId(v);
            var delete = new UmlDeleteOperation(List.of(parentId), Map.of("classifierId", id));

            return new ElementReferencePropertyItem.Reference.Builder(id, label)
               .deleteActions(List.of(delete))
               .build();
         })
         .collect(Collectors.toList());

      return references;
   }

   protected static List<ElementReferencePropertyItem.CreateReference> classifiersAsCreateReferences(
      final RepresentationElementPropertyMapper<?> mapper, final InstanceSpecification instance,
      final String propertyId) {
      var classList = extractUMLClasses(instance.getModel());
      var idGenerator = mapper.getIdGenerator();

      return classList.stream()
         .filter(c -> !instance.getClassifiers().contains(c))
         .map(c -> {
            var action = new UpdateElementPropertyAction(idGenerator.getOrCreateId(instance), propertyId,
               idGenerator.getOrCreateId(c));
            return new ElementReferencePropertyItem.CreateReference.Builder(c.getName(), action).build();
         })
         .collect(Collectors.toList());
   }

   public static List<Class> extractUMLClasses(final Model root) {
      var umlElements = root.getOwnedElements();
      List<Class> classList = new ArrayList<>();

      for (Object element : umlElements) {
         if (element instanceof Class) {
            Class umlClass = (Class) element;
            classList.add(umlClass);
         }
      }

      return classList;
   }

   public static List<Property> extractUMLProperties(final EList<Element> umlElements) {
      List<Property> propertyList = new ArrayList<>();

      for (Object element : umlElements) {
         if (element instanceof Property) {
            Property umlProperty = (Property) element;
            propertyList.add(umlProperty);
         }
      }

      return propertyList;
   }

   public static Property getProperty(final List<Property> properties, final String propertyName) {
      for (Object element : properties) {
         if (element instanceof Property) {
            Property umlProperty = (Property) element;
            if (umlProperty.getName().equals(propertyName)) {
               return umlProperty;
            }
         }
      }

      return null;
   }

   public static List<ElementChoicePropertyItem.Choice> propsAsChoices(final List<Property> properties) {
      return properties.stream()
         .map(c -> new ElementChoicePropertyItem.Choice(c.getName(), c.getName()))
         .collect(Collectors.toList());
   }

}

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
package com.eclipsesource.uml.glsp.uml.utils.element;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementReferencePropertyItem;

public class ClassifierUtils {
   public static List<ElementReferencePropertyItem.Reference> asReferences(final List<Classifier> properties,
      final EMFIdGenerator idGenerator) {
      var references = properties.stream()
         .map(v -> {
            var label = v.getName() == null ? "Operation" : v.getName();
            return new ElementReferencePropertyItem.Reference(idGenerator.getOrCreateId(v), label, v.getName());
         })
         .collect(Collectors.toList());

      return references;
   }

   public static List<Class> extractUMLClasses(final EList<Element> umlElements) {
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

   public static List<ElementChoicePropertyItem.Choice> asChoices(final List<Class> classList) {
      return classList.stream()
         .map(c -> new ElementChoicePropertyItem.Choice(c.getName(), c.getName()))
         .collect(Collectors.toList());
   }

   public static List<ElementChoicePropertyItem.Choice> propsAsChoices(final List<Property> properties) {
      return properties.stream()
         .map(c -> new ElementChoicePropertyItem.Choice(c.getName(), c.getName()))
         .collect(Collectors.toList());
   }

}

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

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.MultiplicityElement;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.glsp.features.property_palette.model.ElementChoicePropertyItem;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.modelserver.core.models.TypeInformation;

public class TypeUtils {
   public static List<ElementChoicePropertyItem.Choice> asChoices(final Set<TypeInformation> typeInformation) {
      var choices = typeInformation.stream()
         .map(v -> {
            var label = name(v);
            return new ElementChoicePropertyItem.Choice.Builder(label, v.id).secondaryText(v.type).build();
         })
         .collect(Collectors.toList());

      choices.add(new ElementChoicePropertyItem.Choice.Builder("<Undefined>", "").build());
      choices.sort((arg0, arg1) -> arg0.label.compareTo(arg1.label));
      return choices;
   }

   public static String name(final TypeInformation typeInformation) {
      if (typeInformation == null) {
         return "<Undefined>";
      }

      return typeInformation.name == null ? "No name" : typeInformation.name;
   }

   public static String name(final Type type) {
      return name(type, "<Undefined>");
   }

   public static String name(final Type type, final String undefined) {
      if (type == null) {
         return undefined;
      }

      return type.getName() == null
         ? type.getClass().getSimpleName().replace("Impl", "")
         : type.getName();
   }

   public static String asText(final Type type, final MultiplicityElement element) {
      return asText(type, "<Undefined>", element);
   }

   public static String asText(final Type type, final String undefined, final MultiplicityElement element) {
      var name = name(type, undefined);
      if (name == null) {
         return undefined;
      }

      var multiplicity = MultiplicityUtil.getMultiplicity(element);

      var label = name;

      if (!multiplicity.equals("1")) {
         label += String.format("[%s]", multiplicity);
      }

      return label;
   }

}
